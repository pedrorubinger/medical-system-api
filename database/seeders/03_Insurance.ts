import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import Insurance from 'App/Models/Insurance'

/** WARNING: Changing any information of the mocked data below can affect the tests results */

export const defaultInsurance = { id: 1, name: 'Life', tenant_id: 1 }

export default class InsuranceSeeder extends BaseSeeder {
  public async run() {
    await Insurance.create(defaultInsurance)
  }
}
