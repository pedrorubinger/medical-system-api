import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { MISSING_TENANT_ID } from '../../utils/constants/errors'

export default class CreateTenantUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [rules.maxLength(100)]),
    phone: schema.string({}, [rules.maxLength(40)]),
    email: schema.string({}, [
      rules.unique({ table: 'users', column: 'email' }),
      rules.maxLength(80),
    ]),
    cpf: schema.string({}, [
      rules.maxLength(20),
      rules.unique({ table: 'users', column: 'cpf' }),
    ]),
    is_admin: schema.boolean(),
    password: schema.string.optional({}, [
      rules.maxLength(255),
      rules.confirmed(),
    ]),
    role: schema.enum(['manager', 'doctor', 'developer']),
    crm_document: schema.string.optional({}, [
      rules.maxLength(20),
      rules.requiredWhen('role', '=', 'doctor'),
      rules.unique({ table: 'doctors', column: 'crm_document' }),
    ]),
    owner_tenant: schema.boolean(),
    tenant_id: schema.number.optional([
      rules.requiredWhen('owner_tenant', '=', false),
    ]),
  })

  public messages = {
    'name.required': 'USER_NAME_IS_REQUIRED',
    'name.maxLength': 'USER_NAME_MAX_LENGTH_100',
    'phone.required': 'PHONE_IS_REQUIRED',
    'phone.maxLength': 'PHONE_MAX_LENGTH_40',
    'email.required': 'EMAIL_IS_REQUIRED',
    'email.maxLength': 'EMAIL_MAX_LENGTH_80',
    'email.unique': 'EMAIL_ALREADY_REGISTERED',
    'cpf.required': 'CPF_IS_REQUIRED',
    'cpf.maxLength': 'CPF_MAX_LENGTH_20',
    'cpf.unique': 'CPF_ALREADY_REGISTERED',
    'is_admin': 'IS_ADMIN_IS_REQUIRED',
    'password.maxLength': 'PASSWORD_MAX_LENGTH_255',
    'confirmed': 'PASSWORDS_DO_NOT_MATCH',
    'role.required': 'ROLE_IS_REQUIRED',
    'crm_document.required': 'CRM_DOCUMENT_IS_REQUIRED',
    'crm_document.unique': 'CRM_DOCUMENT_ALREADY_REGISTERED',
    'crm_document.max_length': 'CRM_DOCUMENT_MAX_LENGTH_20',
    'tenant_id.required': MISSING_TENANT_ID.code,
  }
}
