import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CreateTenantUserValidator from 'App/Validators/CreateTenantUserValidator'
import UserService from 'App/Services/UserService'
import { Role } from 'App/Models/User'
import { MISSING_TENANT_ID } from '../../../utils/constants/errors'

export default class TenantUserController {
  public async store({ auth, request, response }) {
    await request.validate(CreateTenantUserValidator)

    const ownerTenant: boolean | undefined = request.input('owner_tenant')
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
      'tenant_id',
    ])
    const payload =
      auth.user.is_master && !!ownerTenant
        ? {
            ...data,
            is_admin: false,
            is_clinic_owner: false,
            is_master: false,
            tenant_id: auth.user.tenant_id,
            role: 'developer' as Role,
          }
        : { ...data }
    const user = await UserService.store(payload)

    return response.status(201).json(user)
  }

  public async index({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const ownerTenant = request.headers()?.owner_tenant?.toString()
    const tenantId =
      ownerTenant && auth.user!.is_master && ['true', '1'].includes(ownerTenant)
        ? auth.user!.tenant_id
        : Number(request.headers()?.tenant_id)

    if (!tenantId) {
      return response.status(400).json(MISSING_TENANT_ID)
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
    const users = await UserService.getAll(auth.user!.id, tenantId, params)

    return response.status(200).json(users)
  }

  public async destroy({
    auth,
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const ownerTenant = request.headers()?.owner_tenant?.toString()
    const tenantId =
      ownerTenant && auth.user!.is_master && ['true', '1'].includes(ownerTenant)
        ? auth.user!.tenant_id
        : Number(request.headers()?.tenant_id)

    if (!tenantId) {
      return response.status(400).json(MISSING_TENANT_ID)
    }

    await UserService.destroy(params.id, tenantId)
    return response.status(200).json({ success: true })
  }
}
