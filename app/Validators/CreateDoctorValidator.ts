import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateDoctorValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    tenant_id: this.ctx.auth.user!.tenant_id,
  })

  public schema = schema.create({
    user_id: schema.number(),
    crm_document: schema.string({}, [
      rules.maxLength(20),
      rules.unique({
        table: 'doctors',
        column: 'crm_document',
        where: { tenant_id: this.refs.tenant_id },
      }),
    ]),
    private_appointment_price: schema.number.optional(),
    appointment_follow_up_limit: schema.number.optional(),
  })

  public messages = {
    'user_id.required': 'USER_ID_IS_REQUIRED',
    'crm_document.required': 'CRM_DOCUMENT_IS_REQUIRED',
    'crm_document.unique': 'CRM_DOCUMENT_ALREADY_REGISTERED',
    'crm_document.maxLength': 'CRM_DOCUMENT_MAX_LENGTH_20',
  }
}
