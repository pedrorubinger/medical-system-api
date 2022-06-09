import { DateTime } from 'luxon'
import Database from '@ioc:Adonis/Lucid/Database'
import {
  ModelPaginatorContract,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

import AppError from 'App/Exceptions/AppError'
import Appointment from 'App/Models/Appointment'
import Doctor from 'App/Models/Doctor'
import { TENANT_NAME } from '../../utils/constants/tenant'

interface AppointmentData {
  datetime: DateTime
  is_follow_up: boolean
  last_appointment_datetime?: DateTime
  notes?: string
  exam_request?: string
  is_private: boolean
  tenant_id: number
  patient_id: number
  doctor_id: number
  insurance_id: number
  specialty_id: number
  payment_method_id: number
}

interface FetchAppointmentsData {
  page?: number
  perPage?: number
  date?: string
  datetime?: string
  doctor?: number
  status?: string
  patientId?: number
  /** @default 'asc' */
  order?: 'asc' | 'desc'
  /** @default 'date' */
  orderBy?: 'datetime'
}

class AppointmentService {
  public async store(data: AppointmentData): Promise<Appointment> {
    return await Database.transaction(async (trx) => {
      try {
        const appointment = new Appointment()

        appointment.datetime = data.datetime
        appointment.is_follow_up = data.is_follow_up
        appointment.last_appointment_datetime = data.last_appointment_datetime
        appointment.notes = data.notes
        appointment.exam_request = data.exam_request
        appointment.is_private = data.is_private
        appointment.tenant_id = data.tenant_id
        appointment.patient_id = data.patient_id
        appointment.doctor_id = data.doctor_id
        appointment.insurance_id = data.insurance_id
        appointment.specialty_id = data.specialty_id
        appointment.payment_method_id = data.payment_method_id
        appointment.useTransaction(trx)

        const createdAppointment = await appointment.save()
        const doctor = await Doctor.find(data.doctor_id)

        if (!doctor) {
          throw new AppError(
            'This doctor was not found!',
            'DOCTOR_NOT_FOUND',
            404
          )
        }

        doctor.useTransaction(trx)
        await doctor.related('patient').attach(
          {
            [data.patient_id]: {
              tenant_id: data.tenant_id,
            },
          },
          trx
        )
        await trx.commit()
        return createdAppointment
      } catch (err) {
        await trx.rollback()
        throw new AppError(err?.message, err?.code, err?.status)
      }
    })
  }

  public async update(
    id: number,
    tenantId: number,
    data: Partial<AppointmentData>
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
        const {
          date,
          datetime,
          doctor,
          patientId,
          status,
          order,
          orderBy,
          page,
          perPage,
        } = params
        const whereCallback = (
          query: ModelQueryBuilderContract<typeof Appointment, Appointment>
        ) => {
          query.where(TENANT_NAME, tenantId)

          if (date) {
            query.andWhereRaw(`datetime LIKE '${date}%'`)
          }

          if (status) {
            query.andWhere('status', '=', status)
          }

          if (datetime) {
            query.andWhere('datetime', '=', datetime)
          }

          if (doctor) {
            query.andWhere('doctor_id', '=', doctor)
          }

          if (patientId) {
            query.andWhere('patient_id', '=', patientId)
          }
        }

        if (page && perPage) {
          return await Appointment.query()
            .orderBy(orderBy || 'datetime', order || 'asc')
            .where(whereCallback)
            .paginate(page, perPage)
        } else {
          return await Appointment.query()
            .orderBy(orderBy || 'datetime', order || 'asc')
            .where(whereCallback)
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
