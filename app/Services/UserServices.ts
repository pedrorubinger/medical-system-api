import AppError from '../Exceptions/AppError'
import User, { TRole } from '../Models/User'

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
  password?: string
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
      throw new AppError(err)
    }
  }

  public async update(id: number, data: UpdateUser): Promise<User> {
    const user = await User.find(id)

    if (!user) {
      throw new AppError('User not found!')
    }

    user.merge(data)

    const updatedUser = await user.save()

    return updatedUser
  }

  /** TO DO: Implement pagination, searching and sorting... */
  public async getAll(): Promise<User[]> {
    try {
      const users = await User.query()

      return users
    } catch (err: any) {
      throw new AppError(err)
    }
  }

  public async find(id: number): Promise<User> {
    try {
      const user = await User.find(id)

      if (!user) {
        throw new AppError('User not found!')
      }

      return user
    } catch (err) {
      throw new AppError(err)
    }
  }

  public async destroy(id: number): Promise<boolean> {
    try {
      const user = await User.find(id)

      if (!user) {
        throw new AppError('User not found!')
      }

      await user.delete()
      return true
    } catch (err) {
      throw new AppError(err)
    }
  }
}

export default new UserServices()
