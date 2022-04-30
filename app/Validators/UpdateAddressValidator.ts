import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateAddressValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    street: schema.string.optional({}, [rules.maxLength(80)]),
    number: schema.string.optional({}, [rules.maxLength(10)]),
    neighborhood: schema.string.optional({}, [rules.maxLength(50)]),
    postal_code: schema.string.optional({}, [rules.maxLength(15)]),
    complement: schema.string.optional({}, [rules.maxLength(50)]),
  })

  public messages = {
    'street.maxLength': 'STREET_MAX_LENGTH_80',
    'number.maxLength': 'ADDRESS_NUMBER_MAX_LENGTH_10',
    'neighborhood.maxLength': 'NEIGHBORHOOD_MAX_LENGTH_50',
    'postal_code.maxLength': 'POSTAL_CODE_MAX_LENGTH_15',
    'complement.maxLength': 'ADDRESS_COMPLEMENT_MAX_LENGTH_50',
  }
}
