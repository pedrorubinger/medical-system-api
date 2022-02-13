import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RequestPasswordChangeValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({}, [rules.maxLength(80)]),
  })

  public messages = {
    'email.required': 'Email is required!',
    'email.maxLength': 'Email cannot be longer than 80 characters!',
  }
}
