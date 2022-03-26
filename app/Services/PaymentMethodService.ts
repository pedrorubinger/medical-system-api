import {
  ModelPaginatorContract,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

import AppError from 'App/Exceptions/AppError'
import PaymentMethod from 'App/Models/PaymentMethod'
import { TENANT_NAME } from '../../utils/constants/tenant'

interface PaymentMethodData {
  name: string
}

interface FetchPaymentMethodsData {
  page?: number
  perPage?: number
  name?: string
  /** @default 'asc' */
  order?: 'asc' | 'desc'
  /** @default 'name' */
  orderBy?: 'name'
}

class PaymentMethodService {
  public async store(data: PaymentMethodData): Promise<PaymentMethod> {
    try {
      return await PaymentMethod.create(data)
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async update(
    id: number,
    tenantId: number,
    data: PaymentMethodData
  ): Promise<PaymentMethod> {
    try {
      const paymentMethod = await PaymentMethod.find(id)

      if (
        !paymentMethod ||
        tenantId.toString() !== paymentMethod.tenant_id.toString()
      ) {
        throw new AppError(
          'This payment method was not found!',
          'PAYMENT_METHOD_NOT_FOUND',
          404
        )
      }

      paymentMethod.merge({ ...data })
      return await paymentMethod.save()
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async getAll(
    tenantId: number,
    params?: FetchPaymentMethodsData
  ): Promise<ModelPaginatorContract<PaymentMethod> | PaymentMethod[]> {
    try {
      if (params) {
        const { name, order, orderBy, page, perPage } = params
        const whereCallback = (
          query: ModelQueryBuilderContract<typeof PaymentMethod, PaymentMethod>
        ) => {
          query.where(TENANT_NAME, tenantId)

          if (name) {
            query.andWhere('name', 'like', `${name}%`)
          }
        }

        if (page && perPage) {
          return await PaymentMethod.query()
            .orderBy(orderBy || 'name', order || 'asc')
            .where(whereCallback)
            .paginate(page, perPage)
        }
      }

      return await PaymentMethod.query().where(TENANT_NAME, tenantId)
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async find(id: number, tenantId: number): Promise<PaymentMethod> {
    try {
      const paymentMethod = await PaymentMethod.find(id)

      if (
        !paymentMethod ||
        tenantId.toString() !== paymentMethod.tenant_id.toString()
      ) {
        throw new AppError(
          'This payment method was not found!',
          'PAYMENT_METHOD_NOT_FOUND',
          404
        )
      }

      return paymentMethod
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async destroy(id: number, tenantId: number): Promise<boolean> {
    try {
      const paymentMethod = await PaymentMethod.find(id)

      if (
        !paymentMethod ||
        tenantId.toString() !== paymentMethod.tenant_id.toString()
      ) {
        throw new AppError(
          'This payment method was not found!',
          'PAYMENT_METHOD_NOT_FOUND',
          404
        )
      }

      await paymentMethod.delete()
      return true
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }
}

export default new PaymentMethodService()
