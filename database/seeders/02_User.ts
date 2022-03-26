import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Env from '@ioc:Adonis/Core/Env'

import Doctor from 'App/Models/Doctor'
import User, { TRole } from 'App/Models/User'
import {
  defaultInactiveTenantOne,
  defaultOwnerTenant,
  defaultTenant,
  defaultTenantTwo,
} from './01_Tenant'

/** WARNING: Changing any information of the mocked data below can affect the tests results */
export const defaultDeveloperUser = {
  id: 1,
  name: 'Pedro Rubinger',
  cpf: '10545678910',
  role: 'developer' as TRole,
  phone: '31 994999999',
  email: 'pedro@test.com',
  password: 'pedro123',
  is_admin: false,
  is_master: true,
  tenant_id: defaultOwnerTenant.id,
}

export const defaultUser = {
  id: 2,
  name: 'Mark Jones',
  cpf: '12345678910',
  role: 'manager' as TRole,
  phone: '31 999999999',
  email: 'mark@test.com',
  password: 'mark123',
  is_admin: true,
  tenant_id: defaultTenant.id,
  reset_password_token: Env.get('NODE_ENV') === 'testing' ? 't0ken-123' : null,
}

export const defaultDoctorUserOne = {
  id: 3,
  name: 'Jane Doe',
  cpf: '12345678911',
  role: 'doctor' as TRole,
  phone: '31 999999990',
  email: 'jane@test.com',
  password: 'jane123',
  tenant_id: defaultTenant.id,
  is_admin: false,
  reset_password_token: null,
}

export const defaultDoctorUserTwo = {
  id: 4,
  tenant_id: defaultTenant.id,
  name: 'Joseph Doe',
  cpf: '12345678912',
  role: 'doctor' as TRole,
  phone: '31 999999991',
  email: 'joseph@test.com',
  password: 'joseph123',
  is_admin: false,
  reset_password_token: null,
}

export const defaultUserTwo = {
  id: 5,
  name: 'José Eustáquio',
  cpf: '12345670011',
  role: 'doctor' as TRole,
  phone: '31 801106551',
  email: 'jose.eustaquio@test.com',
  password: 'jose123',
  is_admin: true,
  tenant_id: defaultTenantTwo.id,
  reset_password_token: null,
}

export const defaultDeveloperUserTwo = {
  id: 6,
  name: 'João Doe',
  cpf: '10545671110',
  role: 'developer' as TRole,
  phone: '31 994999999',
  email: 'joaodoe@test.com',
  password: 'joao123',
  is_admin: false,
  is_master: false,
  tenant_id: defaultOwnerTenant.id,
}

export const defaultUserThree = {
  id: 7,
  name: 'Morgan J',
  cpf: '02345678010',
  role: 'manager' as TRole,
  phone: '32 999999999',
  email: 'morganj@test.com',
  password: 'morgan123',
  is_admin: true,
  tenant_id: defaultInactiveTenantOne.id,
  reset_password_token: null,
}

export const defaultDoctorOne = {
  id: 1,
  tenant_id: defaultTenant.id,
  crm_document: 'CRM-MG 00009',
  user_id: defaultDoctorUserOne.id,
}

export const defaultDoctorTwo = {
  id: 2,
  tenant_id: defaultTenant.id,
  crm_document: 'CRM-MG 00310',
  user_id: defaultDoctorUserTwo.id,
}

export const defaultDoctorThree = {
  id: 3,
  tenant_id: defaultUserTwo.tenant_id,
  crm_document: 'CRM-PR 83749',
  user_id: defaultUserTwo.id,
}

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.create(defaultDeveloperUser)
    await User.create(defaultDeveloperUserTwo)
    await User.create(defaultUser)
    await User.create(defaultDoctorUserOne)
    await User.create(defaultUserTwo)
    await Doctor.create(defaultDoctorOne)
    await Doctor.create(defaultDoctorThree)
    await User.create(defaultUserThree)

    if (Env.get('NODE_ENV') === 'testing') {
      await User.create(defaultDoctorUserTwo)
      await Doctor.create(defaultDoctorTwo)
    }
  }
}
