import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import DoctorService from 'App/Services/DoctorService'
import CreateDoctorValidator from 'App/Validators/CreateDoctorValidator'
import UpdateDoctorValidator from 'App/Validators/UpdateDoctorValidator'
import ManageDoctorInsuranceValidator from 'App/Validators/ManageDoctorInsuranceValidator'
import { TENANT_NAME } from '../../../utils/constants/tenant'

export default class DoctorController {
  public async store({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    if (!auth.user) {
      return response
        .status(401)
        .json({ message: 'You are not authorized to access this resource!' })
    }

    await request.validate(CreateDoctorValidator)

    const data = {
      ...request.only(['user_id', 'crm_document']),
      [TENANT_NAME]: auth.user.tenant_id,
    }
    const doctor = await DoctorService.store(data)

    return response.status(201).json(doctor)
  }

  public async update({
    auth,
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    if (!auth.user) {
      return response
        .status(401)
        .json({ message: 'You are not authorized to access this resource!' })
    }

    const { id } = params
    const data = request.only(['user_id', 'crm_document'])
    const specialties = request.input('specialties')

    await request.validate(UpdateDoctorValidator)

    const doctor = await DoctorService.update(
      id,
      auth.user.tenant_id,
      data,
      specialties
    )

    return response.status(200).json(doctor)
  }

  public async manageInsurance({
    auth,
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    if (!auth.user) {
      return response
        .status(401)
        .json({ message: 'You are not authorized to access this resource!' })
    }

    const { id } = params
    const flag = request.input('flag')
    const insurances = request.input('insurances')

    await request.validate(ManageDoctorInsuranceValidator)

    const doctor = await DoctorService.manageInsurance(
      id,
      auth.user.tenant_id,
      flag,
      insurances
    )

    return response.status(200).json(doctor)
  }

  public async index({ auth, response }: HttpContextContract): Promise<void> {
    if (!auth.user) {
      return response
        .status(401)
        .json({ message: 'You are not authorized to access this resource!' })
    }

    const doctors = await DoctorService.getAll(auth.user.tenant_id)

    return response.status(200).json(doctors)
  }

  public async show({
    auth,
    params,
    response,
  }: HttpContextContract): Promise<void> {
    if (!auth.user) {
      return response
        .status(401)
        .json({ message: 'You are not authorized to access this resource!' })
    }

    const { id } = params
    const user = await DoctorService.find(id, auth.user.tenant_id)

    return response.status(200).json(user)
  }

  public async destroy({
    auth,
    params,
    response,
  }: HttpContextContract): Promise<void> {
    if (!auth.user) {
      return response
        .status(401)
        .json({ message: 'You are not authorized to access this resource!' })
    }

    await DoctorService.destroy(params.id, auth.user.tenant_id)
    return response.status(200).json({ success: true })
  }
}
