import {
  ModelPaginatorContract,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

import AppError from 'App/Exceptions/AppError'
import Appointment from 'App/Models/Appointment'
import { TENANT_NAME } from '../../utils/constants/tenant'

interface AppointmentData {
  name: string
}

interface FetchAppointmentsData {
  page?: number
  perPage?: number
  datetime?: string
  doctorId?: number
  patientId?: number
  /** @default 'asc' */
  order?: 'asc' | 'desc'
  /** @default 'datetime' */
  orderBy?: 'datetime'
}

class AppointmentService {
  public async store(data: AppointmentData): Promise<Appointment> {
    try {
      return await Appointment.create(data)
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async update(
    id: number,
    tenantId: number,
    data: AppointmentData
  ): Promise<Appointment> {
    try {
      const appointment = await Appointment.find(id)

      if (
        !appointment ||
        tenantId.toString() !== appointment.tenant_id.toString()
      ) {
        throw new AppError(
          'This appointment was not found!',
          'APPOINTMENT_NOT_FOUND',
          404
        )
      }

      appointment.merge({ ...data })
      return await appointment.save()
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async getAll(
    tenantId: number,
    params?: FetchAppointmentsData
  ): Promise<ModelPaginatorContract<Appointment> | Appointment[]> {
    try {
      if (params) {
        const { datetime, doctorId, patientId, order, orderBy, page, perPage } =
          params
        const whereCallback = (
          query: ModelQueryBuilderContract<typeof Appointment, Appointment>
        ) => {
          query.where(TENANT_NAME, tenantId)

          if (datetime) {
            query.andWhere('datetime', '=', `${datetime}`)
          }

          if (doctorId) {
            query.andWhere('doctor_id', '=', `${doctorId}`)
          }

          if (patientId) {
            query.andWhere('patient_id', '=', `${patientId}`)
          }
        }

        if (page && perPage) {
          return await Appointment.query()
            .orderBy(orderBy || 'datetime', order || 'asc')
            .where(whereCallback)
            .paginate(page, perPage)
        }
      }

      return await Appointment.query().where(TENANT_NAME, tenantId)
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async find(id: number, tenantId: number): Promise<Appointment> {
    try {
      const appointment = await Appointment.find(id)

      if (
        !appointment ||
        tenantId.toString() !== appointment.tenant_id.toString()
      ) {
        throw new AppError(
          'This appointment was not found!',
          'APPOINTMENT_NOT_FOUND',
          404
        )
      }

      return appointment
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async destroy(id: number, tenantId: number): Promise<boolean> {
    try {
      const appointment = await Appointment.find(id)

      if (
        !appointment ||
        tenantId.toString() !== appointment.tenant_id.toString()
      ) {
        throw new AppError(
          'This appointment was not found!',
          'APPOINTMENT_NOT_FOUND',
          404
        )
      }

      await appointment.delete()
      return true
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }
}

export default new AppointmentService()
