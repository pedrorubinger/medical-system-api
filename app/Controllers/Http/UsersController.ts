import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import UserService from 'App/Services/UserService'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async store({
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await request.validate(CreateUserValidator)

    const data = request.only([
      'name',
      'email',
      'cpf',
      'phone',
      'is_admin',
      'password',
      'role',
    ])
    const user = await UserService.store(data)

    return response.status(201).json(user)
  }

  public async update({
    auth,
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    if (!auth.user || auth.user.id.toString() !== params.id.toString()) {
      return response
        .status(401)
        .json({ message: 'You are not authorized to access this resource!' })
    }

    const { id } = params
    const data = request.only([
      'name',
      'email',
      'cpf',
      'phone',
      'is_admin',
      'password',
    ])

    try {
      await auth.attempt(auth.user.email, data.password)
    } catch (err) {
      return response
        .status(400)
        .json({ field: 'password', message: 'Invalid password!' })
    }

    await request.validate(UpdateUserValidator)

    const user = await UserService.update(id, data)

    return response.status(200).json(user)
  }

  public async getAll({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    if (!auth.user) {
      return response
        .status(401)
        .json({ message: 'You are not authorized to access this resource!' })
    }

    const { cpf, email, name, order, orderBy, page, perPage, role, filterOwn } =
      request.qs()
    const params = {
      cpf,
      email,
      name,
      order,
      orderBy,
      page,
      perPage,
      role,
      filterOwn: filterOwn === 'true' || filterOwn === true,
    }
    const users = await UserService.getAll(auth.user.id, params)

    return response.status(200).json(users)
  }

  public async find({ params, response }: HttpContextContract): Promise<void> {
    const { id } = params
    const user = await UserService.find(id)

    return response.status(200).json(user)
  }

  public async destroy({
    params,
    response,
  }: HttpContextContract): Promise<void> {
    await UserService.destroy(params.id)
    return response.status(200).json({ success: true })
  }

  public async validateResetToken({
    params,
    response,
  }: HttpContextContract): Promise<void> {
    const user = await UserService.validateResetToken(params.token)

    return response.status(200).json({ success: true, user })
  }
}
