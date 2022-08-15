import test from 'japa'
import { Assert } from 'japa/build/src/Assert'

import SpecialtyService from 'App/Services/SpecialtyService'
import { rollbackMigrations, runMigrations, runSeeds } from '../../japaFile'
import { defaultSpecialty } from '../../database/seeders/04_Specialty'
import {
  defaultDoctorThree,
  defaultDoctorTwo,
} from '../../database/seeders/02_User'

const id = defaultSpecialty.id

test.group('SpecialtyService', (group) => {
  group.before(async () => {
    await rollbackMigrations()
    await runMigrations()
    await runSeeds()
  })

  group.after(async () => {
    await rollbackMigrations()
  })

  test('should return an array with paginated specialties', async (assert: Assert) => {
    const params = {
      page: 1,
      perPage: 10,
      name: defaultSpecialty.name,
      order: 'asc' as const,
      orderBy: 'name' as const,
    }
    const specialties = await SpecialtyService.getAll(
      defaultSpecialty.tenant_id,
      params
    )

    assert.isArray(specialties)
    assert.equal(defaultSpecialty.name, specialties[0].name)
  })

  test('should not update a specialty which id does not exist', async (assert: Assert) => {
    try {
      const data = { name: 'Updated Specialty' }

      await SpecialtyService.update(99, defaultSpecialty.tenant_id, data)
    } catch (err) {
      assert.equal(err.message, 'This specialty was not found!')
    }
  })

  test('should not delete a specialty which id does not exist', async (assert: Assert) => {
    try {
      await SpecialtyService.destroy(99, defaultSpecialty.tenant_id)
    } catch (err) {
      assert.equal(err.message, 'This specialty was not found!')
    }
  })

  test('should not find a specialty which id does not exist', async (assert: Assert) => {
    try {
      await SpecialtyService.find(99, defaultSpecialty.tenant_id)
    } catch (err) {
      assert.equal(err.message, 'This specialty was not found!')
    }
  })

  test('should not create a new specialty with a name that already exists', async (assert: Assert) => {
    try {
      const data = {
        name: defaultSpecialty.name,
        tenant_id: defaultSpecialty.tenant_id,
      }

      await SpecialtyService.store(data)
    } catch (err) {
      assert.equal(err.status, 500)
    }
  })

  test('should not create a specialty with no doctor_id and with invalid payload', async (assert: Assert) => {
    try {
      const data = {
        name: undefined as unknown as string,
        tenant_id: defaultSpecialty.tenant_id,
      }

      await SpecialtyService.store(data)
    } catch (err) {
      assert.equal(err.status, 500)
    }
  })

  test('should not create a new specialty using an invalid doctor_id attribute', async (assert: Assert) => {
    try {
      const data = {
        name: 'New First Invalid Dummy Specialty',
        tenant_id: defaultSpecialty.tenant_id,
      }

      await SpecialtyService.store(data, defaultDoctorThree.id * 363)
    } catch (err) {
      assert.equal(err.status, 404)
    }
  })

  test('should create a new specialty using provided doctor_id attribute', async (assert: Assert) => {
    const data = {
      name: 'New First Dummy Specialty',
      tenant_id: defaultSpecialty.tenant_id,
    }
    const { name } = await SpecialtyService.store(data, defaultDoctorTwo.id)

    assert.equal(name, data.name)
  })

  test('should create a new specialty', async (assert: Assert) => {
    const data = {
      name: 'New Dummy Specialty',
      tenant_id: defaultSpecialty.tenant_id,
    }
    const { name } = await SpecialtyService.store(data)

    assert.equal(name, data.name)
  })

  test('should get all registered specialties', async (assert: Assert) => {
    const specialties = await SpecialtyService.getAll(
      defaultSpecialty.tenant_id
    )

    assert.isArray(specialties)
    assert.equal(defaultSpecialty.name, specialties[0].name)
  })

  test('should get the specified specialty', async (assert: Assert) => {
    const { name } = await SpecialtyService.find(id, defaultSpecialty.tenant_id)

    assert.equal(name, defaultSpecialty.name)
  })

  test('should update the specified specialty', async (assert: Assert) => {
    const specialty = await SpecialtyService.update(
      id,
      defaultSpecialty.tenant_id,
      { name: 'Up Speclt.' }
    )

    assert.equal(specialty.name, 'Up Speclt.')
  })

  test('should delete the specified specialty', async (assert: Assert) => {
    const hasDeleted = await SpecialtyService.destroy(
      id,
      defaultSpecialty.tenant_id
    )

    assert.equal(hasDeleted, true)
  })
})
