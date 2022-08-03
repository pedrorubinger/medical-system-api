import test from 'japa'
import { Assert } from 'japa/build/src/Assert'

import InsuranceService from 'App/Services/InsuranceService'
import { rollbackMigrations, runMigrations, runSeeds } from '../../japaFile'
import { defaultInsurance } from '../../database/seeders/03_Insurance'
import { defaultDoctorOne } from '../../database/seeders/02_User'

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

      await InsuranceService.update(99, defaultInsurance.tenant_id, data)
    } catch (err) {
      assert.equal(err.message, 'This insurance was not found!')
    }
  })

  test('should not delete an insurance which id does not exist', async (assert: Assert) => {
    try {
      await InsuranceService.destroy(99, defaultInsurance.tenant_id)
    } catch (err) {
      assert.equal(err.message, 'This insurance was not found!')
    }
  })

  test('should not find an insurance which id does not exist', async (assert: Assert) => {
    try {
      await InsuranceService.find(99, defaultInsurance.tenant_id)
    } catch (err) {
      assert.equal(err.message, 'This insurance was not found!')
    }
  })

  test('should not create a new insurance with a name that already exists', async (assert: Assert) => {
    try {
      const data = {
        name: defaultInsurance.name,
        tenant_id: defaultInsurance.tenant_id,
      }

      await InsuranceService.store(
        data,
        defaultInsurance.tenant_id,
        defaultDoctorOne.id
      )
    } catch (err) {
      assert.equal(err.status, 500)
    }
  })

  test('should create a new insurance', async (assert: Assert) => {
    const data = {
      name: 'New Dummy Insurance',
      tenant_id: defaultInsurance.tenant_id,
    }
    const { name } = await InsuranceService.store(
      data,
      defaultInsurance.tenant_id,
      defaultDoctorOne.id
    )

    assert.equal(name, data.name)
  })

  test('should get all registered insurances', async (assert: Assert) => {
    const insurances = await InsuranceService.getAll(defaultInsurance.tenant_id)

    assert.isArray(insurances)
    assert.equal(defaultInsurance.name, insurances[0].name)
  })

  test('should get the specified insurance', async (assert: Assert) => {
    const { name } = await InsuranceService.find(id, defaultInsurance.tenant_id)

    assert.equal(name, defaultInsurance.name)
  })

  test('should update the specified insurance', async (assert: Assert) => {
    const insurance = await InsuranceService.update(
      id,
      defaultInsurance.tenant_id,
      { name: 'Up Insurnc.' }
    )

    assert.equal(insurance.name, 'Up Insurnc.')
  })

  test('should delete the specified insurance', async (assert: Assert) => {
    const hasDeleted = await InsuranceService.destroy(
      id,
      defaultInsurance.tenant_id
    )

    assert.equal(hasDeleted, true)
  })
})
