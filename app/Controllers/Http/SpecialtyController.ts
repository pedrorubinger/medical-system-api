import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CreateOrUpdateSpecialtyValidator from 'App/Validators/CreateOrUpdateSpecialtyValidator'
import SpecialtyService from 'App/Services/SpecialtyService'

export default class SpecialtyController {
  public async store({
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await request.validate(CreateOrUpdateSpecialtyValidator)

    const data = request.only(['name'])
    const specialty = await SpecialtyService.store(data)

    return response.status(201).json(specialty)
  }

  public async update({
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await request.validate(CreateOrUpdateSpecialtyValidator)

    const { id } = params
    const data = request.only(['name'])
    const specialty = await SpecialtyService.update(id, data)

    return response.status(200).json(specialty)
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
    const specialties = await SpecialtyService.getAll(params)

    return response.status(200).json(specialties)
  }

  public async show({ params, response }: HttpContextContract): Promise<void> {
    const { id } = params
    const specialty = await SpecialtyService.find(id)

    return response.status(200).json(specialty)
  }

  public async destroy({
    params,
    response,
  }: HttpContextContract): Promise<void> {
    await SpecialtyService.destroy(params.id)
    return response.status(200).json({ success: true })
  }
}
