import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CreateDoctorValidator from 'App/Validators/CreateDoctorValidator'
import DoctorService from 'App/Services/DoctorService'
import UpdateDoctorValidator from 'App/Validators/UpdateDoctorValidator'

export default class DoctorController {
  public async store({
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await request.validate(CreateDoctorValidator)

    const data = request.only(['user_id', 'crm_document'])
    const doctor = await DoctorService.store(data)

    return response.status(201).json(doctor)
  }

  public async update({
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const { id } = params
    const data = request.only(['user_id', 'crm_document'])

    await request.validate(UpdateDoctorValidator)

    const doctor = await DoctorService.update(id, data)

    return response.status(200).json(doctor)
  }

  public async index({ response }: HttpContextContract): Promise<void> {
    const doctors = await DoctorService.getAll()

    return response.status(200).json(doctors)
  }

  public async show({ params, response }: HttpContextContract): Promise<void> {
    const { id } = params
    const user = await DoctorService.find(id)

    return response.status(200).json(user)
  }

  public async destroy({
    params,
    response,
  }: HttpContextContract): Promise<void> {
    await DoctorService.destroy(params.id)
    return response.status(200).json({ success: true })
  }
}
