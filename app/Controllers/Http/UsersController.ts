import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import UserServices from '../../Services/UserServices'
import CreateUserValidator from '../../Validators/CreateUserValidator'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
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
    const user = await UserServices.store(data)

    return response.status(201).json(user)
  }

  public async getAll({ response }: HttpContextContract) {
    const users = await UserServices.getAll()

    return response.status(200).json(users)
  }

  public async find({ params, response }: HttpContextContract) {
    const { id } = params
    const user = await UserServices.find(id)

    return response.status(200).json(user)
  }
}
