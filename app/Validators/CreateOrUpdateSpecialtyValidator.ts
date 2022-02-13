import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateOrUpdateSpecialtyValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [
      rules.maxLength(80),
      rules.unique({ table: 'specialties', column: 'name' }),
    ]),
  })

  public messages = {
    'name.required': 'Specialty name is required!',
    'name.unique': 'This specialty is already registered!',
    'name.maxLength':
      'The specialty name cannot be longer than 80 characters long!',
  }
}
