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
    'required': 'Field {{ field }} is required!',
    'unique': 'This {{ field }} is already registered!',
    'name.maxLength': 'Name cannot be longer than 100 characters long!',
    'cpf.maxLength': 'CPF cannot be longer than 20 characters long!',
    'phone.maxLength': 'Phone number cannot be longer than 40 characters long!',
    'email.maxLength': 'Email cannot be longer than 80 characters long!',
    'password': 'Password cannot be longer than 255 characters long!',
    'new_password': 'New password cannot be longer than 255 characters long!',
  }
}
