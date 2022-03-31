import { DateTime } from 'luxon'

import AppError from 'App/Exceptions/AppError'
import ScheduleDaysOff from 'App/Models/ScheduleDaysOff'
import {
  ModelPaginatorContract,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import { TENANT_NAME } from '../../utils/constants/tenant'

interface ScheduleDaysOffData {
  datetime_start: DateTime
  datetime_end: DateTime
}

interface FindScheduleDaysOffData {
  doctorId: number
  page?: number
  perPage?: number
}

class ScheduleDaysOffService {
  public async store(
    data: ScheduleDaysOffData,
    tenant_id: number
  ): Promise<ScheduleDaysOff> {
    try {
      return await ScheduleDaysOff.create({ ...data, tenant_id })
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async update(
    id: number,
    tenantId: number,
    data: ScheduleDaysOffData
  ): Promise<ScheduleDaysOff> {
    try {
      const scheduleDaysOff = await ScheduleDaysOff.find(id)

      if (
        !scheduleDaysOff ||
        tenantId.toString() !== scheduleDaysOff.tenant_id.toString()
      ) {
        throw new AppError(
          'This schedule days off was not found!',
          'SCHEDULE_DAYS_OFF_NOT_FOUND',
          404
        )
      }

      scheduleDaysOff.merge({ ...data })
      return await scheduleDaysOff.save()
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async findByDoctorId(
    tenantId: number,
    params?: FindScheduleDaysOffData
  ): Promise<ModelPaginatorContract<ScheduleDaysOff> | ScheduleDaysOff[]> {
    try {
      if (params) {
        const { doctorId, page, perPage } = params
        const whereCallback = (
          query: ModelQueryBuilderContract<
            typeof ScheduleDaysOff,
            ScheduleDaysOff
          >
        ) => {
          query.where(TENANT_NAME, tenantId).andWhere('doctor_id', doctorId)
        }

        if (page && perPage) {
          return await ScheduleDaysOff.query()
            .orderBy('created_at')
            .where(whereCallback)
            .paginate(page, perPage)
        }
      }

      return await ScheduleDaysOff.query().where(TENANT_NAME, tenantId)
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async destroy(id: number, tenantId: number): Promise<boolean> {
    try {
      const scheduleDaysOff = await ScheduleDaysOff.find(id)

      if (
        !scheduleDaysOff ||
        tenantId.toString() !== scheduleDaysOff.tenant_id.toString()
      ) {
        throw new AppError(
          'This schedule days off was not found!',
          'SCHEDULE_DAYS_OFF_NOT_FOUND',
          404
        )
      }

      await scheduleDaysOff.delete()
      return true
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }
}

export default new ScheduleDaysOffService()
