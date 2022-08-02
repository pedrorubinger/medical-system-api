import {
  ModelPaginatorContract,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

import { TENANT_NAME } from '../../utils/constants/tenant'
import AppError from 'App/Exceptions/AppError'
import Patient from 'App/Models/Patient'
import Doctor from 'App/Models/Doctor'

interface UpdatePatientData {
  doctor_id: number
  height?: string
  weight?: string
  notes?: string
  illnesses?: string
  allergies?: string
}

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

class MyPatientService {
  public async update(
    id: number,
    tenantId: number,
    data: UpdatePatientData
  ): Promise<Patient> {
    const patient = await Patient.find(id)

    try {
      if (!patient || tenantId.toString() !== patient.tenant_id.toString()) {
        throw new AppError(
          'This patient was not found!',
          'PATIENT_NOT_FOUND',
          404
        )
      }

      await patient.related('doctor').sync(
        {
          [data.doctor_id]: {
            [TENANT_NAME]: tenantId,
            notes: data?.notes || null,
            height: data?.height || null,
            weight: data?.weight || null,
            illnesses: data?.illnesses || null,
            allergies: data?.allergies || null,
          },
        },
        true
      )

      return await patient.save()
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async index(
    tenantId: number,
    doctorId: number,
    params?: FetchPatientsData
  ): Promise<ModelPaginatorContract<Patient> | Patient[]> {
    try {
      const doctor = await Doctor.find(doctorId)

      if (!doctor) {
        throw new AppError(
          'This doctor was not found!',
          'DOCTOR_NOT_FOUND',
          404
        )
      }

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
          query.where(`doctors_patients.${TENANT_NAME}`, tenantId)

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
          return await doctor
            .related('patient')
            .query()
            .orderBy(orderBy || 'name', order || 'asc')
            .where(whereCallback)
            .paginate(page, perPage)
        } else {
          return await doctor.related('patient').query().where(whereCallback)
        }
      }

      return await doctor
        .related('patient')
        .query()
        .where(TENANT_NAME, tenantId)
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }
}

export default new MyPatientService()
