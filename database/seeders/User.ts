import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Env from '@ioc:Adonis/Core/Env'

import User, { TRole } from 'App/Models/User'

export const defaultUser = {
  id: 1,
  name: 'Pedro Rubinger',
  cpf: '12345678910',
  role: 'manager' as TRole,
  phone: '31 999999999',
  email: 'pedro@test.com',
  password: 'pedro123',
  is_admin: true,
  reset_password_token: Env.get('NODE_ENV') === 'testing' ? 't0ken-123' : null,
}

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.create(defaultUser)
  }
}
