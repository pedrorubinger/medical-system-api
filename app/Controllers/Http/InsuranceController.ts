import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CreateOrUpdateInsuranceValidator from 'App/Validators/CreateOrUpdateInsuranceValidator'
import InsuranceService from 'App/Services/InsuranceService'

export default class InsuranceController {
  public async store({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await request.validate(CreateOrUpdateInsuranceValidator)

    const doctorId = request.input('doctorId')
    const data = {
      ...request.only(['name', 'price']),
      tenant_id: auth.user!.tenant_id,
    }
    const insurance = await InsuranceService.store(
      data,
      auth.user!.tenant_id,
      doctorId
    )

    return response.status(201).json(insurance)
  }

  public async update({
    auth,
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await request.validate(CreateOrUpdateInsuranceValidator)

    const { id } = params
    const data = request.only(['name'])
    const insurance = await InsuranceService.update(
      id,
      auth.user!.tenant_id,
      data
    )

    return response.status(200).json(insurance)
  }

  public async index({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const { name, order, orderBy, page, perPage } = request.qs()
    const params = {
      name,
      order,
      orderBy,
      page,
      perPage,
    }
    const insurances = await InsuranceService.getAll(
      auth.user!.tenant_id,
      params
    )

    return response.status(200).json(insurances)
  }

  public async show({
    auth,
    params,
    response,
  }: HttpContextContract): Promise<void> {
    const { id } = params
    const insurance = await InsuranceService.find(id, auth.user!.tenant_id)

    return response.status(200).json(insurance)
  }

  public async destroy({
    auth,
    params,
    response,
  }: HttpContextContract): Promise<void> {
    await InsuranceService.destroy(params.id, auth.user!.tenant_id)
    return response.status(200).json({ success: true })
  }
}
