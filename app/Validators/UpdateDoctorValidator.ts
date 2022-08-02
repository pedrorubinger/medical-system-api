import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateDoctorValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    crm_document: schema.string.optional({}, [
      rules.maxLength(20),
      rules.unique({ table: 'doctors', column: 'crm_document' }),
    ]),
    specialties: schema.array.optional().members(schema.number()),
    payment_methods: schema.array.optional().members(schema.number()),
    private_appointment_price: schema.number.optional(),
    appointment_follow_up_limit: schema.number.optional(),
  })

  public messages = {
    'crm_document.unique': 'CRM_DOCUMENT_ALREADY_REGISTERED',
    'crm_document.maxLength': 'CRM_DOCUMENT_MAX_LENGTH_20',
  }
}
