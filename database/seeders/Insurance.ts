import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import Insurance from 'App/Models/Insurance'

export const defaultInsurance = { id: 1, name: 'Life' }

export default class InsuranceSeeder extends BaseSeeder {
  public async run() {
    await Insurance.create(defaultInsurance)
  }
}
