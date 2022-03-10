import {
  ModelPaginatorContract,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

import AppError from 'App/Exceptions/AppError'
import Insurance from 'App/Models/Insurance'
import { TENANT_NAME } from '../../utils/constants/tenant'

interface InsuranceData {
  name: string
}

interface FetchInsurancesData {
  page?: number
  perPage?: number
  name?: string
  /** @default 'asc' */
  order?: 'asc' | 'desc'
  /** @default 'name' */
  orderBy?: 'name' | 'cpf' | 'role' | 'email'
}

class InsuranceService {
  public async store(data: InsuranceData): Promise<Insurance> {
    try {
      return await Insurance.create(data)
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async update(
    id: number,
    tenantId: number,
    data: InsuranceData
  ): Promise<Insurance> {
    try {
      const insurance = await Insurance.find(id)

      if (
        !insurance ||
        tenantId.toString() !== insurance.tenant_id.toString()
      ) {
        throw new AppError(
          'This insurance was not found!',
          'INSURANCE_NOT_FOUND',
          404
        )
      }

      insurance.merge({ ...data })
      return await insurance.save()
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async getAll(
    tenantId: number,
    params?: FetchInsurancesData
  ): Promise<ModelPaginatorContract<Insurance> | Insurance[]> {
    try {
      if (params) {
        const { name, order, orderBy, page, perPage } = params
        const whereCallback = (
          query: ModelQueryBuilderContract<typeof Insurance, Insurance>
        ) => {
          query.where(TENANT_NAME, tenantId)

          if (name) {
            query.andWhere('name', 'like', `${name}%`)
          }
        }

        if (page && perPage) {
          return await Insurance.query()
            .orderBy(orderBy || 'name', order || 'asc')
            .where(whereCallback)
            .paginate(page, perPage)
        }
      }

      return await Insurance.query().where(TENANT_NAME, tenantId)
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async find(id: number, tenantId: number): Promise<Insurance> {
    try {
      const insurance = await Insurance.find(id)

      if (
        !insurance ||
        tenantId.toString() !== insurance.tenant_id.toString()
      ) {
        throw new AppError(
          'This insurance was not found!',
          'INSURANCE_NOT_FOUND',
          404
        )
      }

      return insurance
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async destroy(id: number, tenantId: number): Promise<boolean> {
    try {
      const insurance = await Insurance.find(id)

      if (
        !insurance ||
        tenantId.toString() !== insurance.tenant_id.toString()
      ) {
        throw new AppError(
          'This insurance was not found!',
          'INSURANCE_NOT_FOUND',
          404
        )
      }

      await insurance.delete()
      return true
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }
}

export default new InsuranceService()
