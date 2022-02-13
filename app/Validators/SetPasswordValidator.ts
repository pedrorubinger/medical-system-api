import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SetPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    password: schema.string({}, [rules.maxLength(255), rules.confirmed()]),
    reset_password_token: schema.string({}),
  })

  public messages = {
    'password.required': 'PASSWORD_IS_REQUIRED',
    'password.maxLength': 'PASSWORD_MAX_LENGTH_255',
    'confirmed': 'PASSWORDS_DO_NOT_MATCH',
    'reset_password_token.required': 'RESET_PASSWORD_TOKEN_IS_REQUIRED',
  }
}
