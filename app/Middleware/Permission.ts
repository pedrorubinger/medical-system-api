import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HAS_NO_PERMISSION_CODE } from '../../utils/constants/errors'

import { TENANT_NAME } from '../../utils/constants/tenant'

type TPermission = 'admin' | 'manager' | 'doctor' | 'developer' | 'master'

export default class Permission {
  public async handle(
    { auth, request, response }: HttpContextContract,
    next: () => Promise<void>,
    properties: TPermission[]
  ) {
    const user = auth?.user

    if (!user) {
      return response
        .status(401)
        .send({ code: 'MUST_PROVIDE_VALID_CREDENTIALS' })
    }

    if (!user?.tenant.is_active) {
      return response
        .status(401)
        .send({ code: 'ACCESS_DENIED_TENANT_IS_INACTIVE' })
    }

    const getUserRoles = (): TPermission[] => {
      let roles: TPermission[] = [user.role]

      if (user.is_admin) {
        roles.push('admin')
      }

      if (user.is_master) {
        roles.push('master')
      }

      return roles
    }

    const userRoles = getUserRoles()
    const hasPermission = userRoles.some((role) =>
      properties.includes(role as TPermission)
    )
    const isDeveloper = user.role === 'developer'
    const userTenant = user.tenant_id.toString()
    const tenantIsInvalid =
      (request.params()?.[TENANT_NAME]?.toString() &&
        userTenant !== request.params()?.[TENANT_NAME]?.toString()) ||
      (request.body()?.[TENANT_NAME]?.toString() &&
        userTenant !== request.body()?.[TENANT_NAME]?.toString()) ||
      (request.qs()?.[TENANT_NAME]?.toString() &&
        userTenant !== request.qs()?.[TENANT_NAME]?.toString()) ||
      (request?.headers()?.[TENANT_NAME]?.toString() &&
        userTenant !== request?.headers()?.[TENANT_NAME]?.toString())

    if ((!isDeveloper && tenantIsInvalid) || !hasPermission) {
      return response.status(401).send(HAS_NO_PERMISSION_CODE)
    }

    return await next()
  }
}
