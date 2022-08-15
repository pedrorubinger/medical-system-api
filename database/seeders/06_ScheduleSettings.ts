import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Env from '@ioc:Adonis/Core/Env'

import ScheduleSettings from 'App/Models/ScheduleSettings'
import { defaultTenant } from './01_Tenant'
import { defaultDoctorTwo } from './02_User'

/** WARNING: Changing any information of the mocked data below can affect the tests results */
export const defaultScheduleSettingsOne = {
  id: 1,
  tenant_id: defaultTenant.id,
  doctor_id: defaultDoctorTwo.id,
  sunday: `{ times: [] }`,
  monday: `{ times: [] }`,
  tuesday: `{ times: [] }`,
  wednesday: `{ times: [] }`,
  thursday: `{ times: [] }`,
  friday: `{ times: [] }`,
  saturday: `{ times: [] }`,
}

export default class ScheduleSettingsSeeder extends BaseSeeder {
  public async run() {
    if (Env.get('NODE_ENV') === 'testing') {
      await ScheduleSettings.create(defaultScheduleSettingsOne)
    }
  }
}
