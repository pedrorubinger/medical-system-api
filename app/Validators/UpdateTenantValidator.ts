import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateTenantValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional({}, [rules.maxLength(100)]),
    isActive: schema.boolean.optional(),
  })

  public messages = {
    'name.maxLength': 'TENANT_NAME_MAX_LENGTH_100',
  }
}
