import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateAddressValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    street: schema.string({}, [rules.maxLength(80)]),
    number: schema.string({}, [rules.maxLength(10)]),
    neighborhood: schema.string({}, [rules.maxLength(50)]),
    postal_code: schema.string({}, [rules.maxLength(15)]),
    complement: schema.string.optional({}, [rules.maxLength(50)]),
  })

  public messages = {
    'street.required': 'STREET_IS_REQUIRED',
    'street.maxLength': 'STREET_MAX_LENGTH_80',
    'number.required': 'ADDRESS_NUMBER_IS_REQUIRED',
    'number.maxLength': 'ADDRESS_NUMBER_MAX_LENGTH_10',
    'neighborhood.required': 'NEIGHBORHOOD_IS_REQUIRED',
    'neighborhood.maxLength': 'NEIGHBORHOOD_MAX_LENGTH_50',
    'postal_code.required': 'POSTAL_CODE_IS_REQUIRED',
    'postal_code.maxLength': 'POSTAL_CODE_MAX_LENGTH_15',
    'complement.maxLength': 'ADDRESS_COMPLEMENT_MAX_LENGTH_50',
  }
}
