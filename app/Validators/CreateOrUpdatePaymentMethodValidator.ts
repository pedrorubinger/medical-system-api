import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateOrUpdatePaymentMethodValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    tenant_id: this.ctx.auth.user!.tenant_id,
  })

  public schema = schema.create({
    name: schema.string({}, [
      rules.maxLength(50),
      rules.unique({
        table: 'payment_methods',
        column: 'name',
        where: { tenant_id: this.refs.tenant_id },
      }),
    ]),
  })

  public messages = {
    'name.required': 'PAYMENT_METHOD_NAME_IS_REQUIRED',
    'name.unique': 'PAYMENT_METHOD_ALREADY_REGISTERED',
    'name.maxLength': 'PAYMENT_METHOD_NAME_MAX_LENGTH_50',
  }
}
