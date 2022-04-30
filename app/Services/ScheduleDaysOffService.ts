import { DateTime } from 'luxon'

import AppError from 'App/Exceptions/AppError'
import ScheduleDaysOff from 'App/Models/ScheduleDaysOff'
import {
  ModelPaginatorContract,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import { TENANT_NAME } from '../../utils/constants/tenant'
import { datesOverlap } from '../../utils/helpers/dates'

interface ScheduleDaysOffData {
  datetime_start: DateTime
  datetime_end: DateTime
}

interface StoreScheduleDaysOffData extends ScheduleDaysOffData {
  doctor_id: number
}

interface FindScheduleDaysOffData {
  doctorId: number
  page?: number
  perPage?: number
}

interface Error {
  errors: {
    field: string
    rule: string
    message: string
  }[]
}

const convertDate = (date: DateTime) =>
  new Date(date.toString()).toISOString().split('T').join(' ').split('.000Z')[0]

class ScheduleDaysOffService {
  public async store(
    data: StoreScheduleDaysOffData,
    tenant_id: number
  ): Promise<{ data?: ScheduleDaysOff; error?: Error }> {
    try {
      const whereCallback = (
        query: ModelQueryBuilderContract<
          typeof ScheduleDaysOff,
          ScheduleDaysOff
        >
      ) => {
        query
          .where(TENANT_NAME, tenant_id)
          .andWhere('doctor_id', data.doctor_id)
      }

      const daysOff = await ScheduleDaysOff.query().where(whereCallback)

      if (
        daysOff.some((dayOff) =>
          datesOverlap(
            {
              datetime_start: convertDate(data.datetime_start),
              datetime_end: convertDate(data.datetime_end),
            },
            {
              datetime_start: convertDate(dayOff.datetime_start),
              datetime_end: convertDate(dayOff.datetime_end),
            }
          )
        )
      ) {
        return {
          error: {
            errors: [
              {
                field: 'datetime_start',
                rule: 'invalid',
                message: 'SCHEDULE_DAYS_OFF_INVALID_RANGE',
              },
              {
                field: 'datetime_end',
                rule: 'invalid',
                message: 'SCHEDULE_DAYS_OFF_INVALID_RANGE',
              },
            ],
          },
        }
      }

      const createdDaysOff = await ScheduleDaysOff.create({
        ...data,
        tenant_id,
      })

      return { data: createdDaysOff }
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
            .orderBy('datetime_start')
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
