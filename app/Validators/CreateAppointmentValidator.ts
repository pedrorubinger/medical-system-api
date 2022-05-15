import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateAppointmentValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    tenant_id: this.ctx.auth.user!.tenant_id,
    doctor_id: this.ctx.request.body().doctor_id,
  })

  public schema = schema.create({
    datetime: schema.date({ format: 'yyyy-MM-dd HH:mm' }, [
      rules.unique({
        table: 'appointments',
        column: 'datetime',
        where: {
          tenant_id: this.refs.tenant_id,
          doctor_id: this.refs.doctor_id,
        },
      }),
    ]),
    is_follow_up: schema.boolean(),
    last_appointment_datetime: schema.date.optional({
      format: 'yyyy-MM-dd HH:mm',
    }),
    notes: schema.string.optional({}),
    exam_request: schema.string.optional({}),
    prescription: schema.string.optional({}),
    status: schema.enum(['confirmed', 'pending', 'cancelled']),
    is_private: schema.boolean(),
  })

  public messages = {
    'datetime.required': 'APPOINTMENT_DATETIME_IS_REQUIRED',
    'datetime.unique': 'APPOINTMENT_DATETIME_MUST_BE_UNIQUE',
    'datetime.format': 'APPOINTMENT_DATETIME_FORMAT',
    'is_follow_up.required': 'APPOINTMENT_IS_FOLLOW_UP_IS_REQUIRED',
    'last_appointment_datetime': 'APPOINTMENT_DATETIME_FORMAT',
    'is_private': 'APPOINTMENT_IS_PRIVATE_IS_REQUIRED',
  }
}
