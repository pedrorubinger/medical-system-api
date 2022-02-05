import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'

import UserService from 'App/Services/UserService'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'
import EmailService from '../../Services/EmailService'

export default class UsersController {
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
    ])
    const user = await UserService.store(data)
    const content = `
      <h1>Bem-vindo(a), ${data.name}!</h1>
      <h2>A sua conta foi criada! Agora você precisa definir uma nova senha começar a utilizar o sistema.</h2>
      <a href="http://localhost:3000/set-password?token=${user.reset_password_token}">Clique aqui para criar sua senha.</a>
    `
    await EmailService.send({
      from: Env.get('SMTP_USERNAME'),
      to: data.email,
      subject: 'Medical System - Acesso',
      content,
    })

    return response.status(201).json(user)
  }

  public async update({
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await request.validate(UpdateUserValidator)

    const { id } = params
    const data = request.only([
      'name',
      'email',
      'cpf',
      'phone',
      'is_admin',
      'role',
    ])
    const user = await UserService.update(id, data)

    return response.status(200).json(user)
  }

  public async getAll({ response }: HttpContextContract): Promise<void> {
    const users = await UserService.getAll()

    return response.status(200).json(users)
  }

  public async find({ params, response }: HttpContextContract): Promise<void> {
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
}
