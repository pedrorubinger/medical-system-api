import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import UserService from 'App/Services/UserService'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'
import SetPasswordValidator from 'App/Validators/SetPasswordValidator'
import RequestPasswordChangeValidator from 'App/Validators/RequestPasswordChangeValidator'
import { HAS_NO_PERMISSION_CODE } from '../../../utils/constants/errors'

export default class UserController {
  public async store({
    auth,
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
      'is_clinic_owner',
      'password',
      'role',
      'tenant_name',
      'crm_document',
    ])
    const user = await UserService.store({
      ...data,
      tenant_id: auth.user!.tenant_id,
    })

    return response.status(201).json(user)
  }

  public async update({
    auth,
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const { id } = params

    if (auth?.user?.id?.toString() !== id?.toString()) {
      return response.status(401).json(HAS_NO_PERMISSION_CODE)
    }

    const data = request.only([
      'name',
      'email',
      'cpf',
      'phone',
      'is_admin',
      'password',
      'new_password',
    ])

    try {
      await auth.attempt(auth.user!.email, data.password)
    } catch (err) {
      return response.status(400).json({
        errors: [
          {
            field: 'password',
            rule: 'invalid',
            message: 'INVALID_PASSWORD',
          },
        ],
      })
    }

    await request.validate(UpdateUserValidator)

    const user = await UserService.update(id, auth.user!.tenant_id, data)

    return response.status(200).json(user)
  }

  public async index({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const tenantId = auth.user!.tenant_id
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
    const users = await UserService.getAll(auth.user!.id, tenantId, params)

    return response.status(200).json(users)
  }

  public async getDoctors({
    auth,
    response,
  }: HttpContextContract): Promise<void> {
    const tenantId = auth.user!.tenant_id
    const users = await UserService.getDoctors(tenantId)

    return response.status(200).json(users)
  }

  public async show({
    auth,
    params,
    response,
  }: HttpContextContract): Promise<void> {
    const { id } = params

    if (id?.toString() !== auth?.user?.id?.toString()) {
      return response
        .status(401)
        .send({ code: 'USER_HAS_NO_PERMISSION_TO_ACCESS_RESOURCE' })
    }

    const user = await UserService.find(id, auth.user!.tenant_id)

    return response.status(200).json(user)
  }

  public async destroy({
    auth,
    params,
    response,
  }: HttpContextContract): Promise<void> {
    await UserService.destroy(params.id, auth.user!.tenant_id)
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
