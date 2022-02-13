import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional({}, [rules.maxLength(100)]),
    phone: schema.string.optional({}, [rules.maxLength(40)]),
    email: schema.string.optional({}, [
      rules.unique({ table: 'users', column: 'email' }),
      rules.maxLength(80),
    ]),
    cpf: schema.string.optional({}, [
      rules.maxLength(20),
      rules.unique({ table: 'users', column: 'cpf' }),
    ]),
    is_admin: schema.boolean.optional(),
    password: schema.string({}, [rules.maxLength(255)]),
    new_password: schema.string.optional({}, [rules.maxLength(255)]),
    role: schema.enum.optional(['manager', 'doctor']),
    crm_document: schema.string.optional({}, [rules.maxLength(20)]),
  })

  public messages = {
    'name.maxLength': 'USER_NAME_MAX_LENGTH_100',
    'phone.maxLength': 'PHONE_MAX_LENGTH_40',
    'email.maxLength': 'EMAIL_MAX_LENGTH_80',
    'email.unique': 'EMAIL_ALREADY_REGISTERED',
    'cpf.maxLength': 'CPF_MAX_LENGTH_20',
    'cpf.unique': 'CPF_ALREADY_REGISTERED',
    'password.maxLength': 'PASSWORD_MAX_LENGTH_255',
    'new_password.maxLength': 'NEW_PASSWORD_MAX_LENGTH_255',
    'crm_document.max_length': 'CRM_DOCUMENT_MAX_LENGTH_20',
  }
}
