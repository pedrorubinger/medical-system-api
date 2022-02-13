import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateInsuranceValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [
      rules.maxLength(80),
      rules.unique({ table: 'insurances', column: 'name' }),
    ]),
  })

  public messages = {
    'name.required': 'INSURANCE_NAME_IS_REQUIRED',
    'name.unique': 'INSURANCE_ALREADY_REGISTERED',
    'name.maxLength': 'INSURANCE_NAME_MAX_LENGTH_80',
  }
}
