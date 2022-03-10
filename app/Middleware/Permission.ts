import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { TENANT_NAME } from '../../utils/constants/tenant'

type TPermission = 'admin' | 'manager' | 'doctor'

const unauthorizedMessage = {
  message: 'You do not have permission to access this resource!',
}

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
        .send({ message: 'You must provide valid credentials!' })
    }

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

    if (
      tenantIsInvalid ||
      (!properties.includes(user.role) &&
        user.is_admin &&
        !properties.includes('admin'))
    ) {
      return response.status(401).send(unauthorizedMessage)
    }

    return await next()
  }
}
