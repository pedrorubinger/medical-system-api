import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserValidator {
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
    name: schema.string.optional({}, [rules.maxLength(100)]),
    phone: schema.string.optional({}, [rules.maxLength(40)]),
    email: schema.string.optional({}, [
      rules.unique({ table: 'users', column: 'email' }),
      rules.maxLength(80),
    ]),
    cpf: schema.string.optional({}, [rules.maxLength(20)]),
    is_admin: schema.boolean.optional(),
    password: schema.string.optional({}, [rules.maxLength(255)]),
    confirmed: schema.string({}, [
      rules.requiredIfExists('password'),
      rules.maxLength(255),
    ]),
    role: schema.enum.optional(['manager', 'doctor']),
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
    'required': 'Field {{ field }} is required!',
    'unique': 'This {{ field }} is already registered!',
    'name.maxLength': 'Name cannot be longer than 100 characters long!',
    'cpf.maxLength': 'CPF cannot be longer than 20 characters long!',
    'phone.maxLength': 'Phone number cannot be longer than 40 characters long!',
    'email.maxLength': 'Email cannot be longer than 80 characters long!',
    'password': 'Password cannot be longer than 255 characters long!',
    'confirmed': 'Passwords do not match!',
  }
}
