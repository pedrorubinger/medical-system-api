import Database from '@ioc:Adonis/Lucid/Database'
import {
  ModelPaginatorContract,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

import { TENANT_NAME } from '../../utils/constants/tenant'
import AppError from 'App/Exceptions/AppError'
import Patient from 'App/Models/Patient'
import Address from 'App/Models/Address'
import AddressService from 'App/Services/AddressService'

interface StorePatientData {
  name: string
  cpf: string
  birthdate: Date
  mother_name: string
  primary_phone: string
  tenant_id: number
  father_name?: string
  secondary_phone?: string
  email?: string
}

interface UpdatePatientData extends Partial<StorePatientData> {}

interface FetchPatientsData {
  page?: number
  perPage?: number
  doctorId?: number
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
  public async store(
    data: StorePatientData,
    addressData?: Address
  ): Promise<Patient> {
    if (addressData) {
      return await Database.transaction(async (trx) => {
        try {
          const patient = new Patient()

          patient.birthdate = data.birthdate
          patient.cpf = data.cpf
          patient.email = data.email
          patient.father_name = data.father_name
          patient.mother_name = data.mother_name
          patient.name = data.name
          patient.primary_phone = data.primary_phone
          patient.secondary_phone = data.secondary_phone
          patient.tenant_id = data.tenant_id
          patient.useTransaction(trx)

          const createdPatient = await patient.save()
          const addressPayload = {
            ...addressData,
            patient_id: createdPatient.id,
          }

          await AddressService.store(addressPayload, trx)
          await trx.commit()
          return createdPatient
        } catch (err) {
          await trx.rollback()
          throw new AppError(err?.message, err?.code, err?.status)
        }
      })
    } else {
      try {
        return await Patient.create(data)
      } catch (err) {
        throw new AppError(err?.message, err?.code, err?.status)
      }
    }
  }

  public async update(
    id: number,
    tenantId: number,
    data: UpdatePatientData,
    addressData?: Address
  ): Promise<Patient> {
    const patient = await Patient.find(id)

    if (!patient || tenantId.toString() !== patient.tenant_id.toString()) {
      throw new AppError(
        'This patient was not found!',
        'PATIENT_NOT_FOUND',
        404
      )
    }

    if (addressData || (!addressData && patient?.address)) {
      return await Database.transaction(async (trx) => {
        try {
          patient.useTransaction(trx)
          patient.merge({ ...data })

          if (!addressData && patient?.address) {
            await AddressService.destroy(patient.address.id, tenantId, trx)
          } else if (addressData) {
            const addressPayload = {
              ...addressData,
              patient_id: patient.id,
              tenant_id: tenantId,
            }

            await AddressService.update(
              addressData.id,
              tenantId,
              addressPayload,
              trx
            )
          }

          const updatedPatient = await patient.save()

          await trx.commit()
          return updatedPatient
        } catch (err) {
          await trx.rollback()
          throw new AppError(err?.message, err?.code, err?.status)
        }
      })
    } else {
      try {
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
  }

  public async getAll(
    tenantId: number,
    params?: FetchPatientsData
  ): Promise<ModelPaginatorContract<Patient> | Patient[]> {
    try {
      if (params) {
        const {
          // doctorId,
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

          // if (doctorId) {
          //   query.andWhere('doctor_id', '=', `${doctorId}`)
          // }

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
            query.andWhere('mother_name', 'like', `${motherName}%`)
          }

          if (primaryPhone) {
            query.andWhere('primary_phone', 'like', `${primaryPhone}%`)
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
