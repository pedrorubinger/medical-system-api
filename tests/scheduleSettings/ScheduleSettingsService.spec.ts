import test from 'japa'
import { Assert } from 'japa/build/src/Assert'
// import Database from '@ioc:Adonis/Lucid/Database'

import ScheduleSettingsService from 'App/Services/ScheduleSettingsService'
import { rollbackMigrations, runMigrations, runSeeds } from '../../japaFile'
import { defaultScheduleSettingsOne } from '../../database/seeders/06_ScheduleSettings'
import {
  defaultDoctorThree,
  // defaultDoctorTwo,
  defaultUser,
} from '../../database/seeders/02_User'

test.group('ScheduleSettingsService', (group) => {
  group.before(async () => {
    await rollbackMigrations()
    await runMigrations()
    await runSeeds()
  })

  group.after(async () => {
    await rollbackMigrations()
  })

  test('should not update schedule settings which id does not exist', async (assert: Assert) => {
    try {
      const data = {
        sunday: `{ times: ['09:00', '10:00', '10:30', '11:00'] }`,
        monday: `{ times: ['13:00'] }`,
        tuesday: `{ times: ['13:00'] }`,
        wednesday: `{ times: ['13:00'] }`,
        thursday: `{ times: ['13:00'] }`,
        friday: `{ times: ['12:00'] }`,
        saturday: `{ times: ['12:00'] }`,
        tenant_id: defaultScheduleSettingsOne.tenant_id,
        doctor_id: defaultScheduleSettingsOne.doctor_id,
      }

      await ScheduleSettingsService.update(
        defaultScheduleSettingsOne.id * 33,
        defaultScheduleSettingsOne.tenant_id,
        data
      )
    } catch (err) {
      assert.equal(err.message, 'This schedule settings were not found!')
      assert.equal(err.status, 404)
    }
  })

  test('should not delete schedule settings which id does not exist', async (assert: Assert) => {
    try {
      await ScheduleSettingsService.destroy(
        defaultScheduleSettingsOne.id * 99,
        defaultScheduleSettingsOne.tenant_id
      )
    } catch (err) {
      assert.equal(err.message, 'This schedule settings were not found!')
      assert.equal(err.status, 404)
    }
  })

  test('should not find schedule settings which id does not exist', async (assert: Assert) => {
    try {
      await ScheduleSettingsService.find(
        defaultScheduleSettingsOne.id * 99,
        defaultScheduleSettingsOne.tenant_id
      )
    } catch (err) {
      assert.equal(err.message, 'This schedule settings were not found!')
      assert.equal(err.status, 404)
    }
  })

  // test('should not create new schedule settings with invalid data', async (assert: Assert) => {
  //   try {
  //     const data = {
  //       sunday: `{ times: ['09:00', '10:00', '10:30', '11:00'] }`,
  //       monday: `{ times: ['13:00'] }`,
  //       tuesday: `{ times: ['13:00'] }`,
  //       wednesday: `{ times: ['13:00'] }`,
  //       thursday: `{ times: ['13:00'] }`,
  //       friday: `{ times: ['12:00'] }`,
  //       saturday: undefined,
  //       tenant_id: defaultScheduleSettingsOne.tenant_id,
  //       doctor_id: defaultScheduleSettingsOne.doctor_id,
  //     }

  //     await ScheduleSettingsService.store(data)
  //   } catch (err) {
  //     assert.equal(err.status, 500)
  //   }
  // })

  test('should not create schedule settings with invalid payload', async (assert: Assert) => {
    try {
      const data = {
        sunday: `{ times: ['09:00', '10:00', '10:30', '11:00'] }`,
        monday: `{ times: ['13:00'] }`,
        tuesday: `{ times: ['13:00'] }`,
        wednesday: `{ times: ['13:00'] }`,
        thursday: `{ times: ['13:00'] }`,
        friday: `{ times: ['12:00'] }`,
        saturday: undefined,
        tenant_id: defaultScheduleSettingsOne.tenant_id,
        doctor_id: defaultScheduleSettingsOne.doctor_id,
      }

      await ScheduleSettingsService.store(data)
    } catch (err) {
      assert.equal(err.status, 500)
    }
  })

  test('should not create new schedule settings using an invalid doctor_id attribute', async (assert: Assert) => {
    try {
      const data = {
        tenant_id: defaultScheduleSettingsOne.tenant_id,
        doctor_id: defaultDoctorThree.id * 363,
      }

      await ScheduleSettingsService.store(data)
    } catch (err) {
      assert.equal(err.status, 500)
    }
  })

  test('should create new schedule settings', async (assert: Assert) => {
    const data = {
      doctor_id: defaultScheduleSettingsOne.doctor_id,
      tenant_id: defaultScheduleSettingsOne.tenant_id,
    }
    const { doctor_id: doctorId } = await ScheduleSettingsService.store(data)

    assert.equal(doctorId, data.doctor_id)
  })

  test('should get all registered scheduled settings', async (assert: Assert) => {
    const scheduleSettings = await ScheduleSettingsService.getAll(
      defaultUser.tenant_id
    )

    assert.isArray(scheduleSettings)
    assert.equal(defaultScheduleSettingsOne.id, scheduleSettings[0].id)
  })

  test('should get the specified schedule settings', async (assert: Assert) => {
    const { id } = await ScheduleSettingsService.find(
      defaultScheduleSettingsOne.id,
      defaultScheduleSettingsOne.tenant_id
    )

    assert.equal(id, defaultScheduleSettingsOne.id)
  })

  test('should update the specified schedule settings', async (assert: Assert) => {
    const data = {
      sunday: `{ times: ['09:00', '10:00', '10:30', '11:00'] }`,
      monday: JSON.stringify(`{ times: ["13:00"] }`),
      tuesday: `{ times: ['13:00'] }`,
      wednesday: `{ times: ['13:00'] }`,
      thursday: `{ times: ['13:00'] }`,
      friday: `{ times: ['12:00'] }`,
      saturday: `{ times: ['12:00'] }`,
      tenant_id: defaultScheduleSettingsOne.tenant_id,
      doctor_id: defaultScheduleSettingsOne.doctor_id,
    }

    const scheduleSettings = await ScheduleSettingsService.update(
      defaultScheduleSettingsOne.id,
      defaultScheduleSettingsOne.tenant_id,
      data
    )

    assert.equal(defaultScheduleSettingsOne.id, scheduleSettings.id)
  })

  test('should delete the specified schedule settings', async (assert: Assert) => {
    const hasDeleted = await ScheduleSettingsService.destroy(
      defaultScheduleSettingsOne.id,
      defaultScheduleSettingsOne.tenant_id
    )

    assert.equal(hasDeleted, true)
  })
})
