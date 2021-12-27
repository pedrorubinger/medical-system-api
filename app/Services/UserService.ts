import AppError from 'App/Exceptions/AppError'
import User, { TRole } from 'App/Models/User'

interface StoreUser {
  name: string
  email: string
  password: string
  phone: string
  cpf: string
  is_admin: boolean
  role: TRole
}

interface UpdateUser {
  name?: string
  email?: string
  // password?: string
  phone?: string
  cpf?: string
  is_admin?: boolean
  role?: TRole
  reset_password_token?: string
}

class UserServices {
  public async store(data: StoreUser): Promise<User> {
    try {
      const user = await User.create(data)

      return user
    } catch (err) {
      throw new AppError(err?.message)
    }
  }

  public async update(id: number, data: UpdateUser): Promise<User> {
    try {
      const user = await User.find(id)

      if (!user) {
        throw new AppError('This user was not found!', 404)
      }

      user.merge(data)
      return await user.save()
    } catch (err) {
      throw new AppError(err?.message, err?.status)
    }
  }

  /** TO DO: Implement pagination, searching and sorting... */
  public async getAll(): Promise<User[]> {
    try {
      return await User.query()
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
}

export default new UserServices()
