import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import Specialty from 'App/Models/Specialty'

/** WARNING: Changing any information of the mocked data below can affect the tests results */

export const defaultSpecialty = { id: 1, name: 'Dermatologista', tenant_id: 2 }

export default class SpecialtySeeder extends BaseSeeder {
  public async run() {
    await Specialty.create(defaultSpecialty)
  }
}
