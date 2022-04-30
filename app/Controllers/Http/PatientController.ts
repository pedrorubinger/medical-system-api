import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import PatientService from 'App/Services/PatientService'
import CreatePatientValidator from 'App/Validators/CreatePatientValidator'
import UpdatePatientValidator from 'App/Validators/UpdatePatientValidator'

export default class PatientController {
  public async store({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await request.validate(CreatePatientValidator)

    const data = {
      ...request.only([
        'name',
        'cpf',
        'birthdate',
        'mother_name',
        'primary_phone',
        'father_name',
        'secondary_phone',
        'email',
      ]),
      tenant_id: auth.user!.tenant_id,
    }
    const patient = await PatientService.store(data)

    return response.status(201).json(patient)
  }

  public async update({
    auth,
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await request.validate(UpdatePatientValidator)

    const { id } = params
    const data = request.only([
      'name',
      'cpf',
      'birthdate',
      'mother_name',
      'primary_phone',
      'father_name',
      'secondary_phone',
      'email',
    ])
    const patient = await PatientService.update(id, auth.user!.tenant_id, data)

    return response.status(200).json(patient)
  }

  public async index({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const {
      street,
      number,
      neighborhood,
      postalCode,
      order,
      orderBy,
      page,
      perPage,
    } = request.qs()
    const params = {
      street,
      number,
      neighborhood,
      postalCode,
      order,
      orderBy,
      page,
      perPage,
    }
    const patients = await PatientService.getAll(auth.user!.tenant_id, params)

    return response.status(200).json(patients)
  }

  public async show({
    auth,
    params,
    response,
  }: HttpContextContract): Promise<void> {
    const { id } = params
    const patient = await PatientService.find(id, auth.user!.tenant_id)

    return response.status(200).json(patient)
  }

  public async destroy({
    auth,
    params,
    response,
  }: HttpContextContract): Promise<void> {
    await PatientService.destroy(params.id, auth.user!.tenant_id)
    return response.status(200).json({ success: true })
  }
}
