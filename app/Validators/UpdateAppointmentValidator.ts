import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateAppointmentValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    tenant_id: this.ctx.auth.user!.tenant_id,
  })

  public schema = schema.create({
    is_follow_up: schema.boolean.optional(),
    notes: schema.string.optional({}),
    exam_request: schema.string.optional({}),
    prescription: schema.string.optional({}),
    status: schema.enum.optional(['confirmed', 'pending', 'cancelled']),
    is_private: schema.boolean.optional(),
  })

  public messages = {}
}
