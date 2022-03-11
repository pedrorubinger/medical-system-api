import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Env from '@ioc:Adonis/Core/Env'

import Doctor from 'App/Models/Doctor'
import User, { TRole } from 'App/Models/User'

/** WARNING: Changing any information of the mocked data below can affect the tests results */

export const defaultUser = {
  id: 1,
  name: 'Pedro Rubinger',
  cpf: '12345678910',
  role: 'manager' as TRole,
  phone: '31 999999999',
  email: 'pedro@test.com',
  password: 'pedro123',
  is_admin: true,
  tenant_id: 1,
  reset_password_token: Env.get('NODE_ENV') === 'testing' ? 't0ken-123' : null,
}

export const defaultDoctorUserOne = {
  id: 2,
  name: 'Jane Doe',
  cpf: '12345678911',
  role: 'doctor' as TRole,
  phone: '31 999999990',
  email: 'jane@test.com',
  password: 'jane123',
  tenant_id: 1,
  is_admin: false,
  reset_password_token: null,
}

export const defaultDoctorUserTwo = {
  id: 3,
  tenant_id: 1,
  name: 'Joseph Doe',
  cpf: '12345678912',
  role: 'doctor' as TRole,
  phone: '31 999999991',
  email: 'joseph@test.com',
  password: 'joseph123',
  is_admin: false,
  reset_password_token: null,
}

export const defaultDoctorOne = {
  id: 1,
  tenant_id: 1,
  crm_document: 'CRM-MG 00009',
  user_id: defaultDoctorUserOne.id,
}

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.create(defaultUser)
    await User.create(defaultDoctorUserOne)
    await Doctor.create(defaultDoctorOne)

    if (Env.get('NODE_ENV') === 'testing') {
      await User.create(defaultDoctorUserTwo)
    }
  }
}
