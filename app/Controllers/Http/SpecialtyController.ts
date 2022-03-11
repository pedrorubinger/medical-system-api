import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CreateOrUpdateSpecialtyValidator from 'App/Validators/CreateOrUpdateSpecialtyValidator'
import SpecialtyService from 'App/Services/SpecialtyService'

export default class SpecialtyController {
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

    await request.validate(CreateOrUpdateSpecialtyValidator)

    const data = { ...request.only(['name']), tenant_id: auth.user.tenant_id }
    const specialty = await SpecialtyService.store(data)

    return response.status(201).json(specialty)
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

    await request.validate(CreateOrUpdateSpecialtyValidator)

    const { id } = params
    const data = request.only(['name'])
    const specialty = await SpecialtyService.update(
      id,
      auth.user.tenant_id,
      data
    )

    return response.status(200).json(specialty)
  }

  public async index({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    if (!auth.user) {
      return response
        .status(401)
        .json({ message: 'You are not authorized to access this resource!' })
    }

    const { name, order, orderBy, page, perPage } = request.qs()
    const params = {
      name,
      order,
      orderBy,
      page,
      perPage,
    }
    const specialties = await SpecialtyService.getAll(
      auth.user?.tenant_id,
      params
    )

    return response.status(200).json(specialties)
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
    const specialty = await SpecialtyService.find(id, auth.user.tenant_id)

    return response.status(200).json(specialty)
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

    await SpecialtyService.destroy(params.id, auth.user.tenant_id)
    return response.status(200).json({ success: true })
  }
}
