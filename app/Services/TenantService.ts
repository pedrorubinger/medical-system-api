import {
  ModelPaginatorContract,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

import AppError from 'App/Exceptions/AppError'
import Tenant from 'App/Models/Tenant'

interface TenantData {
  name: string
  is_active: boolean
}

interface FetchTenantsData {
  page?: number
  perPage?: number
  /** @default false */
  filterOwn?: boolean
  name?: string
  /** @default 'asc' */
  order?: 'asc' | 'desc'
  /** @default 'name' */
  orderBy?: 'name'
}

class TenantService {
  public async store(data: TenantData): Promise<Tenant> {
    try {
      return await Tenant.create(data)
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async update(id: number, data: TenantData): Promise<Tenant> {
    try {
      const tenant = await Tenant.find(id)

      if (!tenant) {
        throw new AppError(
          'This tenant was not found!',
          'TENANT_NOT_FOUND',
          404
        )
      }

      tenant.merge({ ...data })
      return await tenant.save()
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async getAll(
    params?: FetchTenantsData,
    tenantId?: number
  ): Promise<ModelPaginatorContract<Tenant> | Tenant[]> {
    try {
      if (params) {
        const { filterOwn, name, order, orderBy, page, perPage } = params
        const whereCallback = (
          query: ModelQueryBuilderContract<typeof Tenant, Tenant>
        ) => {
          if (filterOwn && tenantId) {
            query.whereNot('id', tenantId)
          }

          if (name) {
            query.andWhere('name', 'like', `${name}%`)
          }
        }

        if (page && perPage) {
          return await Tenant.query()
            .orderBy(orderBy || 'name', order || 'asc')
            .where(whereCallback)
            .paginate(page, perPage)
        }
      }

      return await Tenant.query()
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async find(id: number): Promise<Tenant> {
    try {
      const tenant = await Tenant.find(id)

      if (!tenant) {
        throw new AppError(
          'This tenant was not found!',
          'TENANT_NOT_FOUND',
          404
        )
      }

      return tenant
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async destroy(id: number): Promise<boolean> {
    try {
      const tenant = await Tenant.find(id)

      if (!tenant) {
        throw new AppError(
          'This tenant was not found!',
          'TENANT_NOT_FOUND',
          404
        )
      }

      await tenant.delete()
      return true
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }
}

export default new TenantService()
