import {
  ModelPaginatorContract,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

import AppError from 'App/Exceptions/AppError'
import Address from 'App/Models/Address'
import { TENANT_NAME } from '../../utils/constants/tenant'

interface StoreAddressData {
  street: string
  number: string
  neighborhood: string
  postal_code: string
  complement?: string
}

interface UpdateAddressData extends Partial<StoreAddressData> {}

interface FetchAddressesData {
  page?: number
  perPage?: number
  street?: string
  number?: string
  neighborhood?: string
  postalCode?: string
  /** @default 'asc' */
  order?: 'asc' | 'desc'
  /** @default 'street' */
  orderBy?: 'street'
}

class AddressService {
  public async store(data: StoreAddressData): Promise<Address> {
    try {
      return await Address.create(data)
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async update(
    id: number,
    tenantId: number,
    data: UpdateAddressData
  ): Promise<Address> {
    try {
      const address = await Address.find(id)

      if (!address || tenantId.toString() !== address.tenant_id.toString()) {
        throw new AppError(
          'This address was not found!',
          'ADDRESS_NOT_FOUND',
          404
        )
      }

      address.merge({ ...data })
      return await address.save()
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async getAll(
    tenantId: number,
    params?: FetchAddressesData
  ): Promise<ModelPaginatorContract<Address> | Address[]> {
    try {
      if (params) {
        const {
          street,
          number,
          neighborhood,
          postalCode,
          order,
          orderBy,
          page,
          perPage,
        } = params
        const whereCallback = (
          query: ModelQueryBuilderContract<typeof Address, Address>
        ) => {
          query.where(TENANT_NAME, tenantId)

          if (street) {
            query.andWhere('street', 'like', `${street}%`)
          }

          if (number) {
            query.andWhere('number', '=', `${number}%`)
          }

          if (neighborhood) {
            query.andWhere('neighborhood', 'like', `${neighborhood}%`)
          }

          if (postalCode) {
            query.andWhere('postalCode', 'like', `${postalCode}%`)
          }
        }

        if (page && perPage) {
          return await Address.query()
            .orderBy(orderBy || 'street', order || 'asc')
            .where(whereCallback)
            .paginate(page, perPage)
        }
      }

      return await Address.query().where(TENANT_NAME, tenantId)
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async find(id: number, tenantId: number): Promise<Address> {
    try {
      const address = await Address.find(id)

      if (!address || tenantId.toString() !== address.tenant_id.toString()) {
        throw new AppError(
          'This address was not found!',
          'ADDRESS_NOT_FOUND',
          404
        )
      }

      return address
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async destroy(id: number, tenantId: number): Promise<boolean> {
    try {
      const address = await Address.find(id)

      if (!address || tenantId.toString() !== address.tenant_id.toString()) {
        throw new AppError(
          'This address was not found!',
          'ADDRESS_NOT_FOUND',
          404
        )
      }

      await address.delete()
      return true
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }
}

export default new AddressService()
