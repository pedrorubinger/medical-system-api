import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import AppError from 'App/Exceptions/AppError'

export default class AuthController {
  public async signIn({ auth, request, response }: HttpContextContract) {
    try {
      const { email, password } = request.only(['email', 'password'])
      const token = await auth
        .use('api')
        .attempt(email, password, { expiresIn: '18h' })

      if (!auth?.user?.tenant?.is_active) {
        return response
          .status(401)
          .send({ code: 'ACCESS_DENIED_TENANT_IS_INACTIVE' })
      }

      return response.status(200).json({ user: auth.user, token: token.token })
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async isAuthenticated({
    auth,
    response,
  }: HttpContextContract): Promise<void> {
    try {
      const user = await auth.use('api').authenticate()

      return response.status(200).json({ user })
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }
}
