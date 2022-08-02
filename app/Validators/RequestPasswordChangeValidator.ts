import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RequestPasswordChangeValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({}, [rules.maxLength(80)]),
  })

  public messages = {
    'email.required': 'EMAIL_IS_REQUIRED',
    'email.maxLength': 'EMAIL_MAX_LENGTH_80',
  }
}
