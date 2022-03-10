import test from 'japa'
import { Assert } from 'japa/build/src/Assert'

import SpecialtyService from 'App/Services/SpecialtyService'
import { rollbackMigrations, runMigrations, runSeeds } from '../../japaFile'
import { defaultSpecialty } from '../../database/seeders/04_Specialty'

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

  test('should not update an specialty which id does not exist', async (assert: Assert) => {
    try {
      const data = { name: 'Updated Specialty' }

      await SpecialtyService.update(99, data)
    } catch (err) {
      assert.equal(err.message, 'This specialty was not found!')
    }
  })

  test('should not delete an specialty which id does not exist', async (assert: Assert) => {
    try {
      await SpecialtyService.destroy(99)
    } catch (err) {
      assert.equal(err.message, 'This specialty was not found!')
    }
  })

  test('should not find an specialty which id does not exist', async (assert: Assert) => {
    try {
      await SpecialtyService.find(99)
    } catch (err) {
      assert.equal(err.message, 'This specialty was not found!')
    }
  })

  test('should not create a new specialty with a name that already exists', async (assert: Assert) => {
    try {
      const data = { name: defaultSpecialty.name }

      await SpecialtyService.store(data)
    } catch (err) {
      assert.equal(err.status, 500)
    }
  })

  test('should create a new specialty', async (assert: Assert) => {
    const data = {
      name: 'New Dummy Specialty',
    }
    const { name } = await SpecialtyService.store(data)

    assert.equal(name, data.name)
  })

  test('should get all registered specialties', async (assert: Assert) => {
    const specialties = await SpecialtyService.getAll()

    assert.isArray(specialties)
    assert.equal(defaultSpecialty.name, specialties[0].name)
  })

  test('should get the specified specialty', async (assert: Assert) => {
    const { name } = await SpecialtyService.find(id)

    assert.equal(name, defaultSpecialty.name)
  })

  test('should update the specified specialty', async (assert: Assert) => {
    const specialty = await SpecialtyService.update(id, { name: 'Up Speclt.' })

    assert.equal(specialty.name, 'Up Speclt.')
  })

  test('should delete the specified specialty', async (assert: Assert) => {
    const hasDeleted = await SpecialtyService.destroy(id)

    assert.equal(hasDeleted, true)
  })
})
