import {
  ModelPaginatorContract,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

import AppError from 'App/Exceptions/AppError'
import Specialty from 'App/Models/Specialty'

interface SpecialtyData {
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
  public async store(data: SpecialtyData): Promise<Specialty> {
    try {
      return await Specialty.create(data)
    } catch (err) {
      throw new AppError(err?.message, err?.status)
    }
  }

  public async update(id: number, data: SpecialtyData): Promise<Specialty> {
    try {
      const specialty = await Specialty.find(id)

      if (!specialty) {
        throw new AppError('This specialty was not found!', 404)
      }

      specialty.merge({ ...data })
      return await specialty.save()
    } catch (err) {
      throw new AppError(err?.message, err?.status)
    }
  }

  public async getAll(
    params?: FetchSpecialtiesData
  ): Promise<ModelPaginatorContract<Specialty> | Specialty[]> {
    try {
      if (params) {
        const { name, order, orderBy, page, perPage } = params
        const whereCallback = (
          query: ModelQueryBuilderContract<typeof Specialty, Specialty>
        ) => {
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

      return await Specialty.query()
    } catch (err) {
      throw new AppError(err?.message, err?.status)
    }
  }

  public async find(id: number): Promise<Specialty> {
    try {
      const specialty = await Specialty.find(id)

      if (!specialty) {
        throw new AppError('This specialty was not found!', 404)
      }

      return specialty
    } catch (err) {
      throw new AppError(err?.message, err?.status)
    }
  }

  public async destroy(id: number): Promise<boolean> {
    try {
      const specialty = await Specialty.find(id)

      if (!specialty) {
        throw new AppError('This specialty was not found!', 404)
      }

      await specialty.delete()
      return true
    } catch (err) {
      throw new AppError(err?.message, err?.status)
    }
  }
}

export default new SpecialtyService()
