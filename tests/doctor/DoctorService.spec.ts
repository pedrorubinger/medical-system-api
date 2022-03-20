import test from 'japa'
import { Assert } from 'japa/build/src/Assert'

import DoctorService from 'App/Services/DoctorService'
import { rollbackMigrations, runMigrations, runSeeds } from '../../japaFile'
import { defaultDoctorOne, defaultUser } from '../../database/seeders/02_User'
import { defaultInsurance } from '../../database/seeders/03_Insurance'

test.group('DoctorService', (group) => {
  group.before(async () => {
    await rollbackMigrations()
    await runMigrations()
    await runSeeds()
  })

  group.after(async () => {
    await rollbackMigrations()
  })

  test('should not update a doctor which id does not exist', async (assert: Assert) => {
    try {
      const data = { crm_document: '39823' }

      await DoctorService.update(-335, defaultUser.tenant_id, data)
    } catch (err) {
      assert.equal(err.message, 'This doctor was not found!')
    }
  })

  test('should not update a doctor which tenant_id is different from user tenant_id', async (assert: Assert) => {
    try {
      const data = { crm_document: '390823' }

      await DoctorService.update(defaultDoctorOne.id, -5, data)
    } catch (err) {
      assert.equal(err.message, 'This doctor was not found!')
    }
  })

  test("should not update the doctor's insurances of a doctor which id does not exist", async (assert: Assert) => {
    try {
      const insurances = [{ price: 399, insurance_id: defaultInsurance.id }]

      await DoctorService.manageInsurance(
        defaultDoctorOne.id * -5,
        defaultDoctorOne.tenant_id,
        'attach',
        insurances
      )
    } catch (err) {
      assert.equal(err.message, 'This doctor was not found!')
    }
  })

  test("should not update the doctor's insurances of a doctor which tenant_id is different from user tenant_id", async (assert: Assert) => {
    try {
      const insurances = [{ price: 399, insurance_id: defaultInsurance.id }]

      await DoctorService.manageInsurance(
        defaultDoctorOne.id,
        -5,
        'attach',
        insurances
      )
    } catch (err) {
      assert.equal(err.message, 'This doctor was not found!')
    }
  })

  test('should not delete/dettach a doctor insurance of a doctor which id does not exist', async (assert: Assert) => {
    try {
      const insurances = [{ price: 399, insurance_id: defaultInsurance.id }]

      await DoctorService.manageInsurance(
        defaultDoctorOne.id * -5,
        defaultDoctorOne.tenant_id,
        'dettach',
        insurances
      )
    } catch (err) {
      assert.equal(err.message, 'This doctor was not found!')
    }
  })

  test('should not delete/dettach a doctor insurance of a doctor which tenant_id is different from user tenant_id', async (assert: Assert) => {
    try {
      const insurances = [{ price: 399, insurance_id: defaultInsurance.id }]

      await DoctorService.manageInsurance(
        defaultDoctorOne.id,
        -5,
        'dettach',
        insurances
      )
    } catch (err) {
      assert.equal(err.message, 'This doctor was not found!')
    }
  })

  test("should attach a valid insurance to doctor's insurances list", async (assert: Assert) => {
    const insurances = [{ price: 150, insurance_id: defaultInsurance.id }]
    const response = await DoctorService.manageInsurance(
      defaultDoctorOne.id,
      defaultDoctorOne.tenant_id,
      'attach',
      insurances
    )

    assert.equal(
      response.find((insurance) => insurance.id === defaultInsurance.id)?.id,
      defaultInsurance.id
    )
  })

  test("should dettach a valid insurance to doctor's insurances list", async (assert: Assert) => {
    const insurances = [{ price: 150, insurance_id: defaultInsurance.id }]
    const response = await DoctorService.manageInsurance(
      defaultDoctorOne.id,
      defaultDoctorOne.tenant_id,
      'dettach',
      insurances
    )

    assert.equal(
      response.find((insurance) => insurance.id === defaultInsurance.id)?.id,
      undefined
    )
  })

  test('should find a doctor by user id', async (assert: Assert) => {
    const response = await DoctorService.findByUserId(
      defaultDoctorOne.user_id,
      defaultDoctorOne.tenant_id
    )

    assert.equal(response.user_id, defaultDoctorOne.user_id)
  })

  test('should not find a doctor by user id which user id does not exist', async (assert: Assert) => {
    try {
      await DoctorService.findByUserId(
        defaultDoctorOne.user_id * -55,
        defaultDoctorOne.tenant_id
      )
    } catch (err) {
      assert.equal(err?.message, 'This doctor was not found!')
    }
  })

  test('should not find a doctor by user id which tenant id does not belong to user which is running the search', async (assert: Assert) => {
    try {
      await DoctorService.findByUserId(
        defaultDoctorOne.user_id,
        defaultDoctorOne.tenant_id * -3
      )
    } catch (err) {
      assert.equal(err?.message, 'This doctor was not found!')
    }
  })

  test('should not find a doctor by user id which user id does not exist', async (assert: Assert) => {
    try {
      await DoctorService.findByUserId(
        'making an error' as unknown as number,
        defaultDoctorOne.tenant_id
      )
    } catch (err) {
      assert.equal(err?.message, 'This doctor was not found!')
    }
  })
})
