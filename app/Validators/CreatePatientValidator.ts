import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreatePatientValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    tenant_id: this.ctx.auth.user!.tenant_id,
  })

  public schema = schema.create({
    name: schema.string({}, [rules.maxLength(150)]),
    cpf: schema.string({}, [
      rules.maxLength(20),
      rules.unique({
        table: 'patients',
        column: 'cpf',
        where: { tenant_id: this.refs.tenant_id },
      }),
    ]),
    birthdate: schema.date({}),
    sex: schema.enum(['female', 'male']),
    primary_phone: schema.string({}, [rules.maxLength(30)]),
    mother_name: schema.string({}, [rules.maxLength(150)]),
    father_name: schema.string.optional({}, [rules.maxLength(150)]),
    secondary_phone: schema.string.optional({}, [rules.maxLength(30)]),
    email: schema.string.optional({}, [
      rules.maxLength(80),
      rules.unique({
        table: 'patients',
        column: 'email',
        where: { tenant_id: this.refs.tenant_id },
      }),
    ]),
  })

  public messages = {
    'name.required': 'PATIENT_NAME_IS_REQUIRED',
    'name.maxLength': 'PATIENT_NAME_MAX_LENGTH_150',
    'cpf.required': 'PATIENT_CPF_IS_REQUIRED',
    'cpf.maxLength': 'PATIENT_CPF_MAX_LENGTH_20',
    'cpf.unique': 'PATIENT_CPF_MUST_BE_UNIQUE',
    'birthdate.required': 'PATIENT_BIRTHDATE_IS_REQUIRED',
    'sex.required': 'PATIENT_SEX_IS_REQUIRED',
    'primary_phone.required': 'PATIENT_PRIMARY_PHONE_IS_REQUIRED',
    'primary_phone.maxLength': 'PATIENT_PRIMARY_PHONE_MAX_LENGTH_30',
    'mother_name.required': 'PATIENT_MOTHER_NAME_IS_REQUIRED',
    'mother_name.maxLength': 'PATIENT_MOTHER_NAME_MAX_LENGTH_150',
    'father_name.maxLength': 'PATIENT_FATHER_NAME_MAX_LENGTH_150',
    'secondary_phone.maxLength': 'PATIENT_SECONDARY_PHONE_MAX_LENGTH_30',
    'email.maxLength': 'PATIENT_EMAIL_MAX_LENGTH_80',
    'email.unique': 'PATIENT_EMAIL_MUST_BE_UNIQUE',
  }
}
