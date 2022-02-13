import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
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
    role: schema.enum(['manager', 'doctor']),
    crm_document: schema.string.optional({}, [
      rules.maxLength(20),
      rules.requiredWhen('role', '=', 'doctor'),
      rules.unique({ table: 'doctors', column: 'crm_document' }),
    ]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
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
  }
}
