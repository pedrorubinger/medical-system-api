import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Env from '@ioc:Adonis/Core/Env'

import Insurance from 'App/Models/Insurance'

/** WARNING: Changing any information of the mocked data below can affect the tests results */
export const defaultInsurance = { id: 1, name: 'Life', tenant_id: 2 }

export default class InsuranceSeeder extends BaseSeeder {
  public async run() {
    if (Env.get('NODE_ENV') === 'testing') {
      await Insurance.create(defaultInsurance)
    }
  }
}
