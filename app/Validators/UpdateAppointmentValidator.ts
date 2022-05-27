import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateAppointmentValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    tenant_id: this.ctx.auth.user!.tenant_id,
    // doctor_id: this.ctx.auth.user!.doctor.id,
  })

  public schema = schema.create({
    // datetime: schema.date({ format: 'yyyy-MM-dd HH:mm' }, [
    //   rules.unique({
    //     table: 'appointments',
    //     column: 'datetime',
    //     where: {
    //       tenant_id: this.refs.tenant_id,
    //       doctor_id: this.refs.doctor_id,
    //     },
    //   }),
    // ]),
    is_follow_up: schema.boolean.optional(),
    last_appointment_datetime: schema.date.optional({
      format: 'yyyy-MM-dd HH:mm',
    }),
    notes: schema.string.optional({}),
    exam_request: schema.string.optional({}),
    prescription: schema.string.optional({}),
    status: schema.enum.optional(['confirmed', 'pending', 'cancelled']),
    is_private: schema.boolean.optional(),
  })

  public messages = {}
}
