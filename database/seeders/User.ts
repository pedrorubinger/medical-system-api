import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import User from '../../app/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.create({
      name: 'Pedro Rubinger',
      cpf: '12345678910',
      is_admin: true,
      role: 'manager',
      phone: '31 999999999',
      email: 'pedro@test.com',
      password: 'pedro123',
      reset_password_token: null,
    })
  }
}
