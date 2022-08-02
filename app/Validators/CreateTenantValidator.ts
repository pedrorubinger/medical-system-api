import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateTenantValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [rules.maxLength(100)]),
    is_active: schema.boolean(),
  })

  public messages = {
    'name.required': 'TENANT_NAME_IS_REQUIRED',
    'name.maxLength': 'TENANT_NAME_MAX_LENGTH_100',
    'is_admin': 'TENANT_IS_ACTIVE_IS_REQUIRED',
  }
}
