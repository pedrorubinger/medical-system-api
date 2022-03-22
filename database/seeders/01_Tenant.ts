import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import Tenant from 'App/Models/Tenant'

/** WARNING: Changing any information of the mocked data below can affect the tests results */
export const defaultOwnerTenant = {
  id: 1,
  name: 'MedicalSystem - Developers',
  is_active: true,
}

export const defaultTenant = {
  id: 2,
  name: 'Default Clinic',
  is_active: true,
}

export const defaultTenantTwo = {
  id: 3,
  name: 'Clinic B',
  is_active: true,
}

export const defaultInactiveTenantOne = {
  id: 4,
  name: 'Clinic C',
  is_active: false,
}

export default class TenantSeeder extends BaseSeeder {
  public async run() {
    await Tenant.create(defaultOwnerTenant)
    await Tenant.create(defaultTenant)
    await Tenant.create(defaultTenantTwo)
    await Tenant.create(defaultInactiveTenantOne)
  }
}
