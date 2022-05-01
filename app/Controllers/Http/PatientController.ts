import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import PatientService from 'App/Services/PatientService'
import CreatePatientValidator from 'App/Validators/CreatePatientValidator'
import UpdatePatientValidator from 'App/Validators/UpdatePatientValidator'
import CreatePatientWithAddressValidator from 'App/Validators/CreatePatientWithAddressValidator'
import UpdatePatientWithAddressValidator from 'App/Validators/UpdatePatientWithAddressValidator'

export default class PatientController {
  public async store({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const tenantId = auth.user!.tenant_id
    const address = request.input('address')
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
      tenant_id: tenantId,
    }

    if (address) {
      await request.validate(CreatePatientWithAddressValidator)
    } else {
      await request.validate(CreatePatientValidator)
    }

    const addressData = address
      ? { ...address, tenant_id: tenantId }
      : undefined
    const patient = await PatientService.store(data, addressData)

    return response.status(201).json(patient)
  }

  public async update({
    auth,
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const { id } = params
    const tenantId = auth.user!.tenant_id
    const address = request.input('address')
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
    const addressData = address
      ? { ...address, tenant_id: tenantId }
      : undefined

    if (address) {
      await request.validate(UpdatePatientWithAddressValidator)
    } else {
      await request.validate(UpdatePatientValidator)
    }

    const patient = await PatientService.update(id, tenantId, data, addressData)

    return response.status(200).json(patient)
  }

  public async index({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
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
    } = request.qs()
    const params = {
      name,
      cpf,
      email,
      motherName,
      primaryPhone,
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
