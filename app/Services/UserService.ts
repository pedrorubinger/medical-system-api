import Database from '@ioc:Adonis/Lucid/Database'
import Env from '@ioc:Adonis/Core/Env'
import {
  ModelPaginatorContract,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'

import AppError from 'App/Exceptions/AppError'
import User, { TRole } from 'App/Models/User'
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
  role: TRole
  tenant_id: number
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
  reset_password_token?: string
}

interface FetchUsersData {
  page?: number
  perPage?: number
  email?: string
  name?: string
  cpf?: string
  role?: TRole
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

        const content = `
          <h1>Bem-vindo(a), ${data.name}!</h1>
          <h2>A sua conta foi criada! Agora você precisa definir uma nova senha começar a utilizar o sistema.</h2>
          <a href="http://localhost:3000/set-password?token=${resetPasswordToken}">Clique aqui para criar sua senha.</a>
        `

        await EmailService.send({
          from: Env.get('SMTP_USERNAME'),
          to: data.email,
          subject: 'Medical System - Acesso',
          content,
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
          'CANNOT_DELETE_MASTER_USER'
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
          throw new AppError('This user was not found!', 'USER_NOT_FOUND', 404)
        }

        const token = uuidv4()

        user.useTransaction(trx)
        user.merge({ reset_password_token: token })
        await user.save()

        const content = `
          <h1>Olá, ${user.name}!</h1>
          <h2>Você solicitou uma alteração de senha para o email ${email}.</h2>
          <a href="http://localhost:3000/set-password?token=${token}">Clique aqui para redefinir sua senha.</a>
        `

        await EmailService.send({
          from: Env.get('SMTP_USERNAME'),
          to: email,
          subject: 'Medical System - Alteração de Senha',
          content,
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

      if (!user) {
        throw new AppError(
          'The token does not exist!',
          'TOKEN_DOES_NOT_EXIST',
          404
        )
      }

      if (!user.reset_password_token) {
        throw new AppError(
          'The token is not valid or has expired!',
          'TOKEN_INVALID_OR_HAS_EXPIRED',
          401
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
