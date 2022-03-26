import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import PaymentMethod from 'App/Models/PaymentMethod'
import { defaultTenant } from './01_Tenant'

/** WARNING: Changing any information of the mocked data below can affect the tests results */
export const creditCardPaymentMethod = {
  id: 1,
  name: 'Cartão de Crédito',
  tenant_id: defaultTenant.id,
}

export const debitCardPaymentMethod = {
  id: 2,
  name: 'Cartão de Débito',
  tenant_id: defaultTenant.id,
}

export const cashPaymentMethod = {
  id: 3,
  name: 'Dinheiro',
  tenant_id: defaultTenant.id,
}

export default class InsuranceSeeder extends BaseSeeder {
  public async run() {
    await PaymentMethod.create(creditCardPaymentMethod)
    await PaymentMethod.create(debitCardPaymentMethod)
    await PaymentMethod.create(cashPaymentMethod)
  }
}
