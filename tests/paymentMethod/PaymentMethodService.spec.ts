import test from 'japa'
import { Assert } from 'japa/build/src/Assert'

import PaymentMethodService from 'App/Services/PaymentMethodService'
import { rollbackMigrations, runMigrations, runSeeds } from '../../japaFile'
import { creditCardPaymentMethod } from '../../database/seeders/05_PaymentMethod'
import { defaultDoctorOne } from '../../database/seeders/02_User'

const id = creditCardPaymentMethod.id

test.group('PaymentMethodService', (group) => {
  group.before(async () => {
    await rollbackMigrations()
    await runMigrations()
    await runSeeds()
  })

  group.after(async () => {
    await rollbackMigrations()
  })

  test('should not update a payment method which id does not exist', async (assert: Assert) => {
    try {
      const data = { name: 'Updated Payment Method' }

      await PaymentMethodService.update(
        99,
        creditCardPaymentMethod.tenant_id,
        data
      )
    } catch (err) {
      assert.equal(err.message, 'This payment method was not found!')
    }
  })

  test('should not delete a payment method which id does not exist', async (assert: Assert) => {
    try {
      await PaymentMethodService.destroy(99, creditCardPaymentMethod.tenant_id)
    } catch (err) {
      assert.equal(err.message, 'This payment method was not found!')
    }
  })

  test('should not find a payment method which id does not exist', async (assert: Assert) => {
    try {
      await PaymentMethodService.find(99, creditCardPaymentMethod.tenant_id)
    } catch (err) {
      assert.equal(err.message, 'This payment method was not found!')
    }
  })

  test('should not create a new payment method with a name that already exists', async (assert: Assert) => {
    try {
      const data = {
        name: creditCardPaymentMethod.name,
        tenant_id: creditCardPaymentMethod.tenant_id,
      }

      await PaymentMethodService.store(
        data,
        creditCardPaymentMethod.tenant_id,
        defaultDoctorOne.id
      )
    } catch (err) {
      assert.equal(err.status, 500)
    }
  })

  test('should create a new payment method', async (assert: Assert) => {
    const data = {
      name: 'New Dummy Payment Method',
      tenant_id: creditCardPaymentMethod.tenant_id,
    }
    const { name } = await PaymentMethodService.store(
      data,
      creditCardPaymentMethod.tenant_id,
      defaultDoctorOne.id
    )

    assert.equal(name, data.name)
  })

  test('should get all registered payment methods', async (assert: Assert) => {
    const paymentMethods = await PaymentMethodService.getAll(
      creditCardPaymentMethod.tenant_id
    )

    assert.isArray(paymentMethods)
    assert.equal(creditCardPaymentMethod.name, paymentMethods[0].name)
  })

  test('should get the specified payment method', async (assert: Assert) => {
    const { name } = await PaymentMethodService.find(
      id,
      creditCardPaymentMethod.tenant_id
    )

    assert.equal(name, creditCardPaymentMethod.name)
  })

  test('should update the specified payment method', async (assert: Assert) => {
    const paymentMethod = await PaymentMethodService.update(
      id,
      creditCardPaymentMethod.tenant_id,
      { name: 'Up PaymentMeth.' }
    )

    assert.equal(paymentMethod.name, 'Up PaymentMeth.')
  })

  test('should delete the specified payment method', async (assert: Assert) => {
    const hasDeleted = await PaymentMethodService.destroy(
      id,
      creditCardPaymentMethod.tenant_id
    )

    assert.equal(hasDeleted, true)
  })
})
