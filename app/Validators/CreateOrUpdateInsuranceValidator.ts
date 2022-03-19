import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateInsuranceValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    tenant_id: this.ctx.auth.user!.tenant_id,
  })

  public schema = schema.create({
    name: schema.string({}, [
      rules.maxLength(80),
      rules.unique({
        table: 'insurances',
        column: 'name',
        where: { tenant_id: this.refs.tenant_id },
      }),
    ]),
  })

  public messages = {
    'name.required': 'INSURANCE_NAME_IS_REQUIRED',
    'name.unique': 'INSURANCE_ALREADY_REGISTERED',
    'name.maxLength': 'INSURANCE_NAME_MAX_LENGTH_80',
  }
}
