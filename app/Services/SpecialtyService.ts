import Database from '@ioc:Adonis/Lucid/Database'
import {
  ModelPaginatorContract,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

import { TENANT_NAME } from '../../utils/constants/tenant'
import AppError from 'App/Exceptions/AppError'
import Specialty from 'App/Models/Specialty'
import Doctor from 'App/Models/Doctor'

interface StoreSpecialtyData {
  name: string
  tenant_id: number
}

interface UpdateSpecialtyData {
  name: string
}

interface FetchSpecialtiesData {
  page?: number
  perPage?: number
  name?: string
  /** @default 'asc' */
  order?: 'asc' | 'desc'
  /** @default 'name' */
  orderBy?: 'name' | 'cpf' | 'role' | 'email'
}

class SpecialtyService {
  public async store(
    data: StoreSpecialtyData,
    doctorId?: number
  ): Promise<Specialty> {
    if (!doctorId) {
      try {
        return await Specialty.create(data)
      } catch (err) {
        throw new AppError(err?.message, err?.code, err?.status)
      }
    }

    return await Database.transaction(async (trx) => {
      const tenantId = data.tenant_id

      try {
        const doctor = await Doctor.find(doctorId)

        if (!doctor || tenantId.toString() !== doctor.tenant_id.toString()) {
          throw new AppError(
            'This doctor was not found!',
            'DOCTOR_NOT_FOUND',
            404
          )
        }

        const specialty = new Specialty()

        specialty.name = data.name
        specialty[TENANT_NAME] = tenantId
        specialty.useTransaction(trx)

        const createdSpecialty = await specialty.save()

        const attachIds = (arr: number[]) => {
          const obj = {}

          arr.forEach((item: number) => {
            obj[item] = { tenant_id: tenantId }
          })

          return obj
        }

        await doctor
          .related('specialty')
          .sync(attachIds([createdSpecialty.id]), false, trx)

        await trx.commit()
        return createdSpecialty
      } catch (err) {
        await trx.rollback()
        throw new AppError(err?.message, err?.code, err?.status)
      }
    })
  }

  public async update(
    id: number,
    tenantId: number,
    data: UpdateSpecialtyData
  ): Promise<Specialty> {
    try {
      const specialty = await Specialty.find(id)

      if (
        !specialty ||
        specialty.tenant_id.toString() !== tenantId.toString()
      ) {
        throw new AppError(
          'This specialty was not found!',
          'SPECIALTY_NOT_FOUND',
          404
        )
      }

      specialty.merge({ ...data })
      return await specialty.save()
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async getAll(
    tenantId: number,
    params?: FetchSpecialtiesData
  ): Promise<ModelPaginatorContract<Specialty> | Specialty[]> {
    try {
      if (params) {
        const { name, order, orderBy, page, perPage } = params

        const whereCallback = (
          query: ModelQueryBuilderContract<typeof Specialty, Specialty>
        ) => {
          query.where(TENANT_NAME, tenantId)

          if (name) {
            query.andWhere('name', 'like', `${name}%`)
          }
        }

        if (page && perPage) {
          return await Specialty.query()
            .orderBy(orderBy || 'name', order || 'asc')
            .where(whereCallback)
            .paginate(page, perPage)
        }
      }

      return await Specialty.query().where(TENANT_NAME, tenantId)
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async find(id: number, tenantId: number): Promise<Specialty> {
    try {
      const specialty = await Specialty.find(id)

      if (
        !specialty ||
        tenantId.toString() !== specialty.tenant_id.toString()
      ) {
        throw new AppError(
          'This specialty was not found!',
          'SPECIALTY_NOT_FOUND',
          404
        )
      }

      return specialty
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async destroy(id: number, tenantId: number): Promise<boolean> {
    try {
      const specialty = await Specialty.find(id)

      if (
        !specialty ||
        tenantId.toString() !== specialty.tenant_id.toString()
      ) {
        throw new AppError(
          'This specialty was not found!',
          'SPECIALTY_NOT_FOUND',
          404
        )
      }

      await specialty.delete()
      return true
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }
}

export default new SpecialtyService()
