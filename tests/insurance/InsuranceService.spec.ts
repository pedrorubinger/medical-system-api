import test from 'japa'
import { Assert } from 'japa/build/src/Assert'

import InsuranceService from 'App/Services/InsuranceService'
import { rollbackMigrations, runMigrations, runSeeds } from '../../japaFile'
import { defaultInsurance } from '../../database/seeders/03_Insurance'

const id = defaultInsurance.id

test.group('InsuranceService', (group) => {
  group.before(async () => {
    await rollbackMigrations()
    await runMigrations()
    await runSeeds()
  })

  group.after(async () => {
    await rollbackMigrations()
  })

  test('should not update an insurance which id does not exist', async (assert: Assert) => {
    try {
      const data = { name: 'Updated Insurance' }

      await InsuranceService.update(99, data)
    } catch (err) {
      assert.equal(err.message, 'This insurance was not found!')
    }
  })

  test('should not delete an insurance which id does not exist', async (assert: Assert) => {
    try {
      await InsuranceService.destroy(99)
    } catch (err) {
      assert.equal(err.message, 'This insurance was not found!')
    }
  })

  test('should not find an insurance which id does not exist', async (assert: Assert) => {
    try {
      await InsuranceService.find(99)
    } catch (err) {
      assert.equal(err.message, 'This insurance was not found!')
    }
  })

  test('should not create a new insurance with a name that already exists', async (assert: Assert) => {
    try {
      const data = { name: defaultInsurance.name }

      await InsuranceService.store(data)
    } catch (err) {
      assert.equal(err.status, 500)
    }
  })

  test('should create a new insurance', async (assert: Assert) => {
    const data = {
      name: 'New Dummy Insurance',
    }
    const { name } = await InsuranceService.store(data)

    assert.equal(name, data.name)
  })

  test('should get all registered insurances', async (assert: Assert) => {
    const insurances = await InsuranceService.getAll()

    assert.isArray(insurances)
    assert.equal(defaultInsurance.name, insurances[0].name)
  })

  test('should get the specified insurance', async (assert: Assert) => {
    const { name } = await InsuranceService.find(id)

    assert.equal(name, defaultInsurance.name)
  })

  test('should update the specified insurance', async (assert: Assert) => {
    const insurance = await InsuranceService.update(id, { name: 'Up Insurnc.' })

    assert.equal(insurance.name, 'Up Insurnc.')
  })

  test('should delete the specified insurance', async (assert: Assert) => {
    const hasDeleted = await InsuranceService.destroy(id)

    assert.equal(hasDeleted, true)
  })
})
