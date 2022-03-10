import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import Tenant from 'App/Models/Tenant'

/** WARNING: Changing any information of the mocked data below can affect the tests results */
export const defaultTenant = {
  id: 1,
  name: 'Default Clinic',
  is_active: true,
}

export const defaultTenantTwo = {
  id: 2,
  name: 'Clinic B',
  is_active: true,
}

export default class TenantSeeder extends BaseSeeder {
  public async run() {
    await Tenant.create(defaultTenant)
    await Tenant.create(defaultTenantTwo)
  }
}
