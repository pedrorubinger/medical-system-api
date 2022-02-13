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
    'user_id.required': 'USER_ID_IS_REQUIRED',
    'crm_document.required': 'CRM_DOCUMENT_IS_REQUIRED',
    'crm_document.unique': 'CRM_DOCUMENT_ALREADY_REGISTERED',
    'crm_document.maxLength': 'CRM_DOCUMENT_MAX_LENGTH_20',
  }
}
