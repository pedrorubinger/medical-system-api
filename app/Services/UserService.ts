import Database from '@ioc:Adonis/Lucid/Database'
import Env from '@ioc:Adonis/Core/Env'
import {
  ModelPaginatorContract,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'

import AppError from 'App/Exceptions/AppError'
import User, { Role } from 'App/Models/User'
import EmailService from './EmailService'
import DoctorService from './DoctorService'
import { TENANT_NAME } from '../../utils/constants/tenant'

interface StoreUserData {
  name: string
  email: string
  password?: string
  phone: string
  cpf: string
  is_admin: boolean
  is_clinic_owner: boolean
  role: Role
  tenant_id: number
  tenant_name?: string
  crm_document?: string
}

interface UpdateUserData {
  name?: string
  email?: string
  password?: string
  new_password?: string
  phone?: string
  cpf?: string
  is_admin?: boolean
  is_clinic_owner?: boolean
  reset_password_token?: string
}

interface FetchUsersData {
  page?: number
  perPage?: number
  email?: string
  name?: string
  cpf?: string
  role?: Role
  /** @default false */
  filterOwn?: boolean
  /** @default 'asc' */
  order?: 'asc' | 'desc'
  /** @default 'name' */
  orderBy?: 'name' | 'cpf' | 'role' | 'email'
}

interface ValidateResetTokenResponse {
  email: string
  id: number
}

interface SetPasswordData {
  reset_password_token: string
  password: string
  confirmed: string
}

class UserService {
  public async store(data: StoreUserData): Promise<User> {
    return await Database.transaction(async (trx) => {
      try {
        const user = new User()
        const resetPasswordToken = uuidv4()

        user.name = data.name
        user.tenant_id = data.tenant_id
        user.password = data?.password || undefined
        user.reset_password_token = resetPasswordToken
        user.email = data.email
        user.phone = data.phone
        user.cpf = data.cpf
        user.is_admin = data.is_admin || false
        user.is_clinic_owner = data.is_clinic_owner || false
        user.role = data.role
        user.useTransaction(trx)

        const createdUser = await user.save()

        if (data.role === 'doctor' && data.crm_document) {
          await DoctorService.store(
            {
              user_id: createdUser.id,
              tenant_id: data.tenant_id,
              crm_document: data.crm_document,
            },
            trx
          )
        }

        await EmailService.send({
          path: 'emails/set_password',
          subject: 'Medical System - Acesso',
          from: Env.get('SMTP_USERNAME'),
          to: data.email,
          content: {
            url: `${Env.get(
              'CLIENT_DOMAIN'
            )}/set-password?token=${resetPasswordToken}`,
            name: createdUser.name,
            tenant_name: data?.tenant_name,
            year: new Date().getFullYear().toString(),
          },
        })
        await trx.commit()
        return createdUser
      } catch (err) {
        await trx.rollback()
        throw new AppError(err?.message, err?.code, err?.status)
      }
    })
  }

  public async update(
    id: number,
    tenantId: number,
    data: UpdateUserData
  ): Promise<User> {
    try {
      const user = await User.find(id)
      const payload = { ...data }

      if (!user || user.tenant_id.toString() !== tenantId.toString()) {
        throw new AppError('This user was not found!', 'USER_NOT_FOUND', 404)
      }

      if (data.new_password) {
        payload.password = data.new_password
        delete payload.new_password
      }

      user.merge(payload)
      return await user.save()
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async getAll(
    userId: number,
    tenantId: number,
    params?: FetchUsersData
  ): Promise<ModelPaginatorContract<User> | User[]> {
    try {
      if (params?.filterOwn && !userId) {
        throw new AppError('This user was not found!', 'USER_NOT_FOUND', 404)
      }

      if (params) {
        const {
          cpf,
          email,
          filterOwn,
          name,
          order,
          orderBy,
          page,
          perPage,
          role,
        } = params
        const whereCallback = (
          query: ModelQueryBuilderContract<typeof User, User>
        ) => {
          query.where(TENANT_NAME, tenantId)

          if (filterOwn) {
            query.andWhereNot('id', userId)
          }

          if (cpf) {
            query.andWhere('cpf', 'like', `%${cpf}%`)
          }

          if (email) {
            query.andWhere('email', 'like', `%${email}%`)
          }

          if (name) {
            query.andWhere('name', 'like', `${name}%`)
          }

          if (role) {
            query.andWhere('role', '=', role)
          }
        }

        if (page && perPage) {
          return await User.query()
            .preload('doctor')
            .orderBy(orderBy || 'name', order || 'asc')
            .where(whereCallback)
            .paginate(page, perPage)
        }
      }

      return await User.query()
        .preload('doctor')
        .where((query) => {
          query.where(TENANT_NAME, tenantId)

          if (params?.filterOwn) {
            query.andWhereNot('id', userId)
          }
        })
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async getDoctors(tenantId: number): Promise<User[]> {
    try {
      return await User.query()
        .where('users.tenant_id', tenantId)
        .andWhere('role', 'doctor')
        .select('name', 'id', 'tenant_id')
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async find(id: number, tenantId: number): Promise<User> {
    try {
      const user = await User.find(id)

      if (!user || user.tenant_id.toString() !== tenantId.toString()) {
        throw new AppError('This user was not found!', 'USER_NOT_FOUND', 404)
      }

      return user
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async destroy(id: number, tenantId: number): Promise<boolean> {
    try {
      const user = await User.find(id)

      if (!user || user.tenant_id.toString() !== tenantId.toString()) {
        throw new AppError('This user was not found!', 'USER_NOT_FOUND', 404)
      }

      if (user.is_master) {
        throw new AppError(
          'You cannot delete this user!',
          'CANNOT_DELETE_MASTER_USER',
          401
        )
      }

      await user.delete()
      return true
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async requestPasswordChange(email: string): Promise<boolean> {
    return await Database.transaction(async (trx) => {
      try {
        const user = await User.findBy('email', email)

        if (!user) {
          return true
        }

        const token = uuidv4()

        user.useTransaction(trx)
        user.merge({ reset_password_token: token })
        await user.save()

        await EmailService.send({
          path: 'emails/recover_password',
          from: Env.get('SMTP_USERNAME'),
          to: email,
          subject: 'MedApp - Alteração de Senha',
          content: {
            url: `http://localhost:3000/set-password?token=${token}`,
            name: user.name,
            year: new Date().getFullYear().toString(),
          },
        })
        trx.commit()
        return true
      } catch (err) {
        trx.rollback()
        throw new AppError(err?.message, err?.code, err?.status)
      }
    })
  }

  public async validateResetToken(
    token: string
  ): Promise<ValidateResetTokenResponse> {
    try {
      const user = await User.findBy('reset_password_token', token)

      if (!user || !user.reset_password_token) {
        throw new AppError(
          'The token does not exist!',
          'TOKEN_DOES_NOT_EXIST',
          404
        )
      }

      return { email: user.email, id: user.id }
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async setPassword(id: number, data: SetPasswordData): Promise<User> {
    try {
      const user = await User.find(id)

      if (!user) {
        throw new AppError('This user was not found!', 'USER_NOT_FOUND', 404)
      }

      if (user.reset_password_token !== data.reset_password_token) {
        throw new AppError(
          'You are not authorized to reset your password!',
          'NOT_AUTHORIZED_TO_RESET_PASSWORD',
          401
        )
      }

      user.merge({ password: data.password, reset_password_token: null })
      return await user.save()
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }
}

export default new UserService()
