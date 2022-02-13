import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SetPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    password: schema.string({}, [rules.maxLength(255), rules.confirmed()]),
    reset_password_token: schema.string({}),
  })

  public messages = {
    required: 'Field {{ field }} is required!',
    unique: 'This {{ field }} is already registered!',
    password: 'Password cannot be longer than 255 characters long!',
    confirmed: 'Passwords do not match!',
  }
}
