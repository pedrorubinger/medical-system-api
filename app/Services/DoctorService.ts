import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

import AppError from 'App/Exceptions/AppError'
import Doctor from 'App/Models/Doctor'
import Insurance from 'App/Models/Insurance'
import { TENANT_NAME } from '../../utils/constants/tenant'
import ScheduleSettingsService from './ScheduleSettingsService'

interface InsuranceData {
  insurance_id: number
  price: number
}

interface StoreDoctorData {
  crm_document: string
  user_id: number
  tenant_id: number
  private_appointment_price?: number
  appointment_follow_up_limit?: number
}

interface UpdateDoctorData {
  crm_document?: string
  user_id?: number
  private_appointment_price?: number
  appointment_follow_up_limit?: number
}

class DoctorService {
  public async store(
    data: StoreDoctorData,
    providedTrx?: TransactionClientContract
  ): Promise<Doctor> {
    const doctor = new Doctor()

    doctor.user_id = data.user_id
    doctor.crm_document = data.crm_document
    doctor.tenant_id = data.tenant_id
    doctor.private_appointment_price = data.private_appointment_price || 0
    doctor.appointment_follow_up_limit = data.appointment_follow_up_limit || 15

    if (providedTrx) {
      try {
        doctor.useTransaction(providedTrx)

        const createdDoctor = await doctor.save()

        await ScheduleSettingsService.store(
          {
            doctor_id: createdDoctor.id,
            tenant_id: data.tenant_id,
          },
          providedTrx
        )
        return createdDoctor
      } catch (err) {
        throw new AppError(err?.message, err?.code, err?.status)
      }
    } else {
      return await Database.transaction(async (trx) => {
        try {
          doctor.useTransaction(trx)

          const createdDoctor = await doctor.save()

          await ScheduleSettingsService.store(
            {
              doctor_id: createdDoctor.id,
              tenant_id: data.tenant_id,
            },
            trx
          )
          await trx.commit()
          return doctor
        } catch (err) {
          await trx.rollback()
          throw new AppError(err?.message, err?.code, err?.status)
        }
      })
    }
  }

  public async update(
    id: number,
    tenantId: number,
    data: UpdateDoctorData,
    specialties?: number[],
    paymentMethods?: number[]
  ): Promise<Doctor> {
    const trx = await Database.transaction()

    const attachIds = (arr: number[]) => {
      const obj = {}

      arr.forEach((item: number) => {
        obj[item] = { tenant_id: tenantId }
      })

      return obj
    }

    try {
      const doctor = await Doctor.find(id)

      if (!doctor || tenantId.toString() !== doctor.tenant_id.toString()) {
        throw new AppError(
          'This doctor was not found!',
          'DOCTOR_NOT_FOUND',
          404
        )
      }

      if (specialties?.length) {
        await doctor
          .related('specialty')
          .sync(attachIds(specialties), true, trx)
      } else {
        await doctor.related('specialty').detach()
      }

      if (paymentMethods?.length) {
        await doctor
          .related('payment_method')
          .sync(attachIds(paymentMethods), true, trx)
      } else {
        await doctor.related('payment_method').detach()
      }

      doctor.merge(data)
      doctor.useTransaction(trx)

      const updatedDoctor = await doctor.save()

      await trx.commit()
      return updatedDoctor
    } catch (err) {
      await trx.rollback()
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async manageInsurance(
    id: number,
    tenantId: number,
    flag: 'attach' | 'dettach',
    insurances: InsuranceData[],
    providedTrx?: TransactionClientContract
  ): Promise<Insurance[]> {
    const attachInsurances = (arr: InsuranceData[]) => {
      const obj = {}

      arr.forEach((item: InsuranceData) => {
        obj[item.insurance_id] = { tenant_id: tenantId, price: item.price }
      })

      return obj
    }

    const trx = providedTrx ? providedTrx : await Database.transaction()

    try {
      const doctor = await Doctor.find(id)

      if (!doctor || tenantId.toString() !== doctor.tenant_id.toString()) {
        throw new AppError(
          'This doctor was not found!',
          'DOCTOR_NOT_FOUND',
          404
        )
      }

      if (flag === 'attach') {
        await doctor
          .related('insurance')
          .sync(attachInsurances(insurances), false, trx)
      }

      if (flag === 'dettach') {
        await doctor
          .related('insurance')
          .detach([...insurances].map((insurance) => insurance.insurance_id))
      }

      doctor.useTransaction(trx)

      const doctorInsurances = await (await doctor.save())
        .related('insurance')
        .query()

      await trx.commit()
      return doctorInsurances
    } catch (err) {
      await trx.rollback()
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async getAll(
    tenantId: number
  ): Promise<ModelPaginatorContract<Doctor> | Doctor[]> {
    try {
      return await Doctor.query().where(TENANT_NAME, tenantId)
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async find(id: number, tenantId: number): Promise<Doctor> {
    try {
      const doctor = await Doctor.find(id)

      if (!doctor || tenantId.toString() !== doctor.tenant_id.toString()) {
        throw new AppError(
          'This doctor was not found!',
          'DOCTOR_NOT_FOUND',
          404
        )
      }

      return doctor
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async findByUserId(userId: number, tenantId: number): Promise<Doctor> {
    try {
      const doctor = await Doctor.findBy('user_id', userId)

      if (!doctor || tenantId.toString() !== doctor.tenant_id.toString()) {
        throw new AppError(
          'This doctor was not found!',
          'DOCTOR_NOT_FOUND',
          404
        )
      }

      return doctor
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async destroy(id: number, tenantId: number): Promise<boolean> {
    try {
      const doctor = await Doctor.find(id)

      if (!doctor || tenantId.toString() !== doctor.tenant_id.toString()) {
        throw new AppError(
          'This doctor was not found!',
          'DOCTOR_NOT_FOUND',
          404
        )
      }

      await doctor.delete()
      return true
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }
}

export default new DoctorService()
