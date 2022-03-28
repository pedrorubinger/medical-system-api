import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

import AppError from 'App/Exceptions/AppError'
import ScheduleSettings from 'App/Models/ScheduleSettings'
import { TENANT_NAME } from '../../utils/constants/tenant'

interface ScheduleSettingsData {
  sunday?: string | undefined
  monday?: string | undefined
  tuesday?: string | undefined
  wednesday?: string | undefined
  thursday?: string | undefined
  friday?: string | undefined
  saturday?: string | undefined
}

interface StoreScheduleSettingsData extends ScheduleSettingsData {
  doctor_id: number
  tenant_id: number
}

interface UpdateScheduleSettingsData extends ScheduleSettingsData {
  doctor_id: number
}

const defaultTimes: string[] = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
]
const defaultScheduleSettings = {
  sunday: {
    times: [],
  },
  monday: {
    times: defaultTimes,
  },
  tuesday: {
    times: defaultTimes,
  },
  wednesday: {
    times: defaultTimes,
  },
  thursday: {
    times: defaultTimes,
  },
  friday: {
    times: defaultTimes,
  },
  saturday: {
    times: [],
  },
}

class ScheduleSettingsService {
  public async store(
    data: StoreScheduleSettingsData,
    providedTrx?: TransactionClientContract
  ): Promise<ScheduleSettings> {
    try {
      if (providedTrx) {
        const scheduleSettings = new ScheduleSettings()

        scheduleSettings.doctor_id = data.doctor_id
        scheduleSettings.tenant_id = data.tenant_id
        scheduleSettings.sunday = JSON.stringify(defaultScheduleSettings.sunday)
        scheduleSettings.monday = JSON.stringify(defaultScheduleSettings.monday)
        scheduleSettings.tuesday = JSON.stringify(
          defaultScheduleSettings.tuesday
        )
        scheduleSettings.wednesday = JSON.stringify(
          defaultScheduleSettings.wednesday
        )
        scheduleSettings.thursday = JSON.stringify(
          defaultScheduleSettings.thursday
        )
        scheduleSettings.friday = JSON.stringify(defaultScheduleSettings.friday)
        scheduleSettings.saturday = JSON.stringify(
          defaultScheduleSettings.saturday
        )
        scheduleSettings.useTransaction(providedTrx)

        return await scheduleSettings.save()
      } else {
        return await ScheduleSettings.create(data)
      }
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async update(
    id: number,
    tenantId: number,
    data: UpdateScheduleSettingsData
  ): Promise<ScheduleSettings> {
    try {
      const scheduleSettings = await ScheduleSettings.find(id)

      if (
        !scheduleSettings ||
        tenantId.toString() !== scheduleSettings.tenant_id.toString()
      ) {
        throw new AppError(
          'This schedule settings were not found!',
          'SCHEDULE_SETTINGS_NOT_FOUND',
          404
        )
      }

      scheduleSettings.sunday = JSON.stringify(data?.sunday)
      scheduleSettings.monday = JSON.stringify(data?.monday)
      scheduleSettings.tuesday = JSON.stringify(data?.tuesday)
      scheduleSettings.wednesday = JSON.stringify(data?.wednesday)
      scheduleSettings.thursday = JSON.stringify(data?.thursday)
      scheduleSettings.friday = JSON.stringify(data?.friday)
      scheduleSettings.saturday = JSON.stringify(data?.saturday)
      return await scheduleSettings.save()
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async getAll(
    tenantId: number
  ): Promise<ModelPaginatorContract<ScheduleSettings> | ScheduleSettings[]> {
    try {
      return await ScheduleSettings.query().where(TENANT_NAME, tenantId)
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async find(id: number, tenantId: number): Promise<ScheduleSettings> {
    try {
      const scheduleSettings = await ScheduleSettings.find(id)

      if (
        !scheduleSettings ||
        tenantId.toString() !== scheduleSettings.tenant_id.toString()
      ) {
        throw new AppError(
          'This schedule settings were not found!',
          'SCHEDULE_SETTINGS_NOT_FOUND',
          404
        )
      }

      return scheduleSettings
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async destroy(id: number, tenantId: number): Promise<boolean> {
    try {
      const scheduleSettings = await ScheduleSettings.find(id)

      if (
        !scheduleSettings ||
        tenantId.toString() !== scheduleSettings.tenant_id.toString()
      ) {
        throw new AppError(
          'This schedule settings were not found!',
          'SCHEDULE_SETTINGS_NOT_FOUND',
          404
        )
      }

      await scheduleSettings.delete()
      return true
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }
}

export default new ScheduleSettingsService()
