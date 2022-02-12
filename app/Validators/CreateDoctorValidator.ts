import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateDoctorValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    user_id: schema.number(),
    crm_document: schema.string({}, [
      rules.maxLength(20),
      rules.unique({ table: 'doctors', column: 'crm_document' }),
    ]),
  })

  public messages = {
    'required': 'Field {{ field }} is required!',
    'unique': 'This {{ field }} is already registered!',
    'crm_document.maxLength': 'CRM cannot be longer than 20 characters long!',
  }
}
