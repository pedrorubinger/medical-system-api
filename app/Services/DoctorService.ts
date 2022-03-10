import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

import AppError from 'App/Exceptions/AppError'
import Doctor from 'App/Models/Doctor'
import { TENANT_NAME } from '../../utils/constants/tenant'

interface StoreDoctorData {
  crm_document: string
  user_id: number
  tenant_id: number
}

interface UpdateDoctorData {
  crm_document?: string
  user_id?: number
}

class DoctorService {
  public async store(
    data: StoreDoctorData,
    trx?: TransactionClientContract
  ): Promise<Doctor> {
    try {
      if (trx) {
        const doctor = new Doctor()

        doctor.user_id = data.user_id
        doctor.crm_document = data.crm_document
        doctor.tenant_id = data.tenant_id
        doctor.useTransaction(trx)
        return await doctor.save()
      } else {
        return await Doctor.create(data)
      }
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async update(
    id: number,
    tenantId: number,
    data: UpdateDoctorData
  ): Promise<Doctor> {
    try {
      const doctor = await Doctor.find(id)

      if (!doctor || tenantId.toString() !== doctor.tenant_id.toString()) {
        throw new AppError(
          'This doctor was not found!',
          'DOCTOR_NOT_FOUND',
          404
        )
      }

      doctor.merge(data)
      return await doctor.save()
    } catch (err) {
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
