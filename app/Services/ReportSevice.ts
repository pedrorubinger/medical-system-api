import AppError from 'App/Exceptions/AppError'
import Appointment from 'App/Models/Appointment'
import Doctor from 'App/Models/Doctor'
import Insurance from 'App/Models/Insurance'
import PaymentMethod from 'App/Models/PaymentMethod'
import Specialty from 'App/Models/Specialty'
import Patient from 'App/Models/Patient'
import User from 'App/Models/User'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

type ReportPermission = 'doctor' | 'admin'

interface GetAllReportsParams {
  permission: ReportPermission
  tenantId: number
  doctorId?: number
  initialDate?: string
  finalDate?: string
}

class ReportService {
  public async getAll({
    permission,
    tenantId,
    doctorId,
    initialDate,
    finalDate,
  }: GetAllReportsParams): Promise<any> {
    try {
      if (doctorId) {
        const whereCallback = (
          query: ModelQueryBuilderContract<typeof Doctor, Doctor>
        ) => {
          query.where('id', doctorId).andWhere('doctors.tenant_id', tenantId)

          if (initialDate && finalDate) {
            query
              .andWhere('doctors.created_at', '>=', initialDate)
              .andWhere('doctors.created_at', '<=', finalDate)
          }
        }

        const doctor = await Doctor.query()
          .preload('insurance', (builder) => {
            if (initialDate && finalDate) {
              builder
                .where('insurances.created_at', '>=', initialDate)
                .andWhere('insurances.created_at', '<=', finalDate)
            }
          })
          .preload('patient', (builder) => {
            if (initialDate && finalDate) {
              builder
                .where('patients.created_at', '>=', initialDate)
                .andWhere('patients.created_at', '<=', finalDate)
            }
          })
          .preload('payment_method', (builder) => {
            if (initialDate && finalDate) {
              builder
                .where('payment_methods.created_at', '>=', initialDate)
                .andWhere('payment_methods.created_at', '<=', finalDate)
            }
          })
          .preload('specialty', (builder) => {
            if (initialDate && finalDate) {
              builder
                .where('specialties.created_at', '>=', initialDate)
                .andWhere('specialties.created_at', '<=', finalDate)
            }
          })
          .where(whereCallback)

        const appointments = await Appointment.query()
          .where('tenant_id', tenantId)
          .andWhere('doctor_id', doctorId)
        const doctorObject = doctor[0]?.toJSON()
        const result = doctor?.[0]
          ? {
              ...doctorObject,
              paymentMethods: doctorObject?.payment_methods,
              insurances: doctorObject?.insurance,
              patients: doctorObject?.patient,
              specialties: doctorObject?.specialty,
              appointments,
            }
          : []

        return { result }
      } else {
        if (permission === 'admin') {
          const whereCallback = (query: ModelQueryBuilderContract<any>) => {
            query.where('tenant_id', tenantId)

            if (initialDate && finalDate) {
              query
                .andWhere('created_at', '>=', initialDate)
                .andWhere('created_at', '<=', finalDate)
            }
          }

          const appointments = await Appointment.query().where(whereCallback)
          const doctors = await Doctor.query().where(whereCallback)
          const insurances = await Insurance.query().where(whereCallback)
          const patients = await Patient.query().where(whereCallback)
          const paymentMethods = await PaymentMethod.query().where(
            whereCallback
          )
          const specialties = await Specialty.query().where(whereCallback)
          const users = await User.query().where(whereCallback)

          return {
            result: {
              appointments,
              doctors,
              insurances,
              patients,
              paymentMethods,
              specialties,
              users,
            },
          }
        }
      }
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }
}

export default new ReportService()
