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

interface StoreUserData {
  name: string
  email: string
  password?: string
  phone: string
  cpf: string
  is_admin: boolean
  role: TRole
}

interface UpdateUserData {
  name?: string
  email?: string
  password?: string
  phone?: string
  cpf?: string
  is_admin?: boolean
  role?: TRole
  reset_password_token?: string
}

interface FetchUsersData {
  page?: number
  perPage?: number
  email?: string
  name?: string
  cpf?: string
  role?: TRole
  /** @default 'asc' */
  order?: 'asc' | 'desc'
  /** @default 'name' */
  orderBy?: 'name' | 'cpf' | 'role' | 'email'
}

interface ValidateResetTokenResponse {
  email: string
  id: number
}

class UserServices {
  public async store(data: StoreUserData): Promise<User> {
    return await Database.transaction(async (trx) => {
      try {
        const user = new User()

        user.name = data.name
        user.password = data?.password || null
        user.reset_password_token = uuidv4()
        user.email = data.email
        user.phone = data.phone
        user.cpf = data.cpf
        user.is_admin = data.is_admin || false
        user.role = data.role
        user.useTransaction(trx)

        const content = `
          <h1>Bem-vindo(a), ${data.name}!</h1>
          <h2>A sua conta foi criada! Agora você precisa definir uma nova senha começar a utilizar o sistema.</h2>
          <a href="http://localhost:3000/set-password?token=${user.reset_password_token}">Clique aqui para criar sua senha.</a>
        `

        await EmailService.send({
          from: Env.get('SMTP_USERNAME'),
          to: data.email,
          subject: 'Medical System - Acesso',
          content,
        })

        const createdUser = await user.save()

        await trx.commit()
        return createdUser
      } catch (err) {
        await trx.rollback()
        throw new AppError(err?.message)
      }
    })
  }

  public async update(id: number, data: UpdateUserData): Promise<User> {
    try {
      const user = await User.find(id)

      if (!user) {
        throw new AppError('This user was not found!', 404)
      }

      user.merge({ ...data, reset_password_token: null })
      return await user.save()
    } catch (err) {
      throw new AppError(err?.message, err?.status)
    }
  }

  public async getAll(
    userId: number,
    params?: FetchUsersData
  ): Promise<ModelPaginatorContract<User> | User[]> {
    try {
      if (params) {
        const { cpf, email, name, order, orderBy, page, perPage, role } = params

        if (page && perPage) {
          return await User.query()
            .orderBy(orderBy || 'name', order || 'asc')
            .where((query: ModelQueryBuilderContract<typeof User, User>) => {
              query.whereNot('id', userId)

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
            })
            .paginate(page, perPage)
        }
      }

      return await User.query().where((query) => {
        query.whereNot('id', userId)
      })
    } catch (err) {
      throw new AppError(err?.message, err?.status)
    }
  }

  public async find(id: number): Promise<User> {
    try {
      const user = await User.find(id)

      if (!user) {
        throw new AppError('This user was not found!', 404)
      }

      return user
    } catch (err) {
      throw new AppError(err?.message, err?.status)
    }
  }

  public async destroy(id: number): Promise<boolean> {
    try {
      const user = await User.find(id)

      if (!user) {
        throw new AppError('This user was not found!', 404)
      }

      await user.delete()
      return true
    } catch (err) {
      throw new AppError(err?.message, err?.status)
    }
  }

  public async validateResetToken(
    token: string
  ): Promise<ValidateResetTokenResponse> {
    try {
      const user = await User.findBy('reset_password_token', token)

      if (!user) {
        throw new AppError('The token does not exist!', 404)
      }

      if (!user.reset_password_token) {
        throw new AppError('The token is not valid or has expired!', 401)
      }

      return { email: user.email, id: user.id }
    } catch (err) {
      throw new AppError(err?.message, err?.status)
    }
  }
}

export default new UserServices()
