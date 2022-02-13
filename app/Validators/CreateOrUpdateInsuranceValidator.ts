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
    'name.required': 'Insurance name is required!',
    'name.unique': 'This insurance is already registered!',
    'name.maxLength':
      'The insurance name cannot be longer than 80 characters long!',
  }
}
