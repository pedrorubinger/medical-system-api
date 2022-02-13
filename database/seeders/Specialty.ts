import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import Specialty from 'App/Models/Specialty'

export const defaultSpecialty = { id: 1, name: 'Dermatologista' }

export default class SpecialtySeeder extends BaseSeeder {
  public async run() {
    await Specialty.create(defaultSpecialty)
  }
}
