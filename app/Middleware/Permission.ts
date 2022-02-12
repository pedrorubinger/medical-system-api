import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

type TPermission = 'admin' | 'manager' | 'doctor'

const unauthorizedMessage = {
  message: 'You do not have permission to access this resource!',
}

export default class Permission {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    properties: TPermission[]
  ) {
    const user = auth?.user

    if (!user) {
      return response
        .status(401)
        .send({ message: 'You must provide valid credentials!' })
    }

    if (
      !properties.includes(user.role) &&
      user.is_admin &&
      !properties.includes('admin')
    ) {
      return response.status(401).send(unauthorizedMessage)
    }

    return await next()
  }
}
