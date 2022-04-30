import {
  ModelPaginatorContract,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

import AppError from 'App/Exceptions/AppError'
import Patient from 'App/Models/Patient'
import { TENANT_NAME } from '../../utils/constants/tenant'

interface StorePatientData {
  name: string
  cpf: string
  birthdate: Date
  mother_name: string
  primary_phone: string
  father_name?: string
  secondary_phone?: string
  email?: string
}

interface UpdatePatientData extends Partial<StorePatientData> {}

interface FetchPatientsData {
  page?: number
  perPage?: number
  name?: string
  cpf?: string
  email?: string
  motherName?: string
  primaryPhone?: string
  /** @default 'asc' */
  order?: 'asc' | 'desc'
  /** @default 'name' */
  orderBy?: 'name'
}

class PatientService {
  public async store(data: StorePatientData): Promise<Patient> {
    try {
      return await Patient.create(data)
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async update(
    id: number,
    tenantId: number,
    data: UpdatePatientData
  ): Promise<Patient> {
    try {
      const patient = await Patient.find(id)

      if (!patient || tenantId.toString() !== patient.tenant_id.toString()) {
        throw new AppError(
          'This patient was not found!',
          'PATIENT_NOT_FOUND',
          404
        )
      }

      patient.merge({ ...data })
      return await patient.save()
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async getAll(
    tenantId: number,
    params?: FetchPatientsData
  ): Promise<ModelPaginatorContract<Patient> | Patient[]> {
    try {
      if (params) {
        const {
          name,
          cpf,
          email,
          motherName,
          primaryPhone,
          order,
          orderBy,
          page,
          perPage,
        } = params
        const whereCallback = (
          query: ModelQueryBuilderContract<typeof Patient, Patient>
        ) => {
          query.where(TENANT_NAME, tenantId)

          if (name) {
            query.andWhere('name', 'like', `${name}%`)
          }

          if (cpf) {
            query.andWhere('cpf', 'like', `${cpf}%`)
          }

          if (email) {
            query.andWhere('email', 'like', `${email}%`)
          }

          if (motherName) {
            query.andWhere('motherName', 'like', `${motherName}%`)
          }

          if (primaryPhone) {
            query.andWhere('primaryPhone', 'like', `${primaryPhone}%`)
          }
        }

        if (page && perPage) {
          return await Patient.query()
            .orderBy(orderBy || 'name', order || 'asc')
            .where(whereCallback)
            .paginate(page, perPage)
        }
      }

      return await Patient.query().where(TENANT_NAME, tenantId)
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async find(id: number, tenantId: number): Promise<Patient> {
    try {
      const patient = await Patient.find(id)

      if (!patient || tenantId.toString() !== patient.tenant_id.toString()) {
        throw new AppError(
          'This patient was not found!',
          'PATIENT_NOT_FOUND',
          404
        )
      }

      return patient
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async destroy(id: number, tenantId: number): Promise<boolean> {
    try {
      const patient = await Patient.find(id)

      if (!patient || tenantId.toString() !== patient.tenant_id.toString()) {
        throw new AppError(
          'This patient was not found!',
          'PATIENT_NOT_FOUND',
          404
        )
      }

      await patient.delete()
      return true
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }
}

export default new PatientService()
