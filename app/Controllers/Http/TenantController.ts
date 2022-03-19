import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CreateTenantValidator from 'App/Validators/CreateTenantValidator'
import UpdateTenantValidator from 'App/Validators/UpdateTenantValidator'
import TenantService from 'App/Services/TenantService'
import { HAS_NO_PERMISSION_CODE } from '../../../utils/constants/errors'

export default class TenantController {
  public async store({
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await request.validate(CreateTenantValidator)

    const data = request.only(['name', 'is_active'])
    const tenant = await TenantService.store(data)

    return response.status(201).json(tenant)
  }

  public async update({
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const { id } = params
    const data = request.only(['name', 'is_active'])

    await request.validate(UpdateTenantValidator)

    const tenant = await TenantService.update(id, data)

    return response.status(200).json(tenant)
  }

  public async index({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    if (!auth.user) {
      return response.status(401).json(HAS_NO_PERMISSION_CODE)
    }

    const { filterOwn, name, order, orderBy, page, perPage } = request.qs()

    const getFilterOwn = (): boolean => {
      if (auth?.user?.is_master) {
        return ['true', true].includes(filterOwn)
      }

      return true
    }

    const params = {
      name,
      order,
      orderBy,
      page,
      perPage,
      filterOwn: getFilterOwn(),
    }
    const tenants = await TenantService.getAll(params, auth.user.tenant_id)

    return response.status(200).json(tenants)
  }

  public async show({ params, response }: HttpContextContract): Promise<void> {
    const { id } = params
    const tenant = await TenantService.find(id)

    return response.status(200).json(tenant)
  }

  public async destroy({
    params,
    response,
  }: HttpContextContract): Promise<void> {
    await TenantService.destroy(params.id)
    return response.status(200).json({ success: true })
  }
}
