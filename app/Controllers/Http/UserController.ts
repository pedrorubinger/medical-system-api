import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import UserService from 'App/Services/UserService'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'
import SetPasswordValidator from 'App/Validators/SetPasswordValidator'
import RequestPasswordChangeValidator from 'App/Validators/RequestPasswordChangeValidator'

export default class UserController {
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
      'crm_document',
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

  public async show({ params, response }: HttpContextContract): Promise<void> {
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

  public async requestPasswordChange({
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const data = request.only(['email'])

    await request.validate(RequestPasswordChangeValidator)

    const success = await UserService.requestPasswordChange(data.email)

    return response.status(200).json({ success })
  }

  public async setPassword({
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const { id } = params
    const data = request.only(['reset_password_token', 'password', 'confirmed'])

    await request.validate(SetPasswordValidator)

    const user = await UserService.setPassword(id, data)

    return response.status(200).json(user)
  }
}
