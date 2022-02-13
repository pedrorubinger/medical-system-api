import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CreateInsuranceValidator from 'App/Validators/CreateInsuranceValidator'
import InsuranceService from 'App/Services/InsuranceService'

export default class InsuranceController {
  public async store({
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await request.validate(CreateInsuranceValidator)

    const data = request.only(['name'])
    const insurance = await InsuranceService.store(data)

    return response.status(201).json(insurance)
  }

  public async update({
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await request.validate(CreateInsuranceValidator)

    const { id } = params
    const data = request.only(['name'])
    const insurance = await InsuranceService.update(id, data)

    return response.status(200).json(insurance)
  }

  public async index({
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
    const insurances = await InsuranceService.getAll(params)

    return response.status(200).json(insurances)
  }

  public async show({ params, response }: HttpContextContract): Promise<void> {
    const { id } = params
    const insurance = await InsuranceService.find(id)

    return response.status(200).json(insurance)
  }

  public async destroy({
    params,
    response,
  }: HttpContextContract): Promise<void> {
    await InsuranceService.destroy(params.id)
    return response.status(200).json({ success: true })
  }
}
