import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HAS_NO_PERMISSION_CODE } from '../../utils/constants/errors'

import { TENANT_NAME } from '../../utils/constants/tenant'

type TPermission = 'admin' | 'manager' | 'doctor'

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

    const userRoles = user.is_admin ? ['admin', user.role] : [user.role]
    const hasPermission = userRoles.some((role) =>
      properties.includes(role as TPermission)
    )
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

    if (tenantIsInvalid || !hasPermission) {
      return response.status(401).send(HAS_NO_PERMISSION_CODE)
    }

    return await next()
  }
}
