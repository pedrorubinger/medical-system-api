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
    files: schema.array.optional().members(
      schema.file({
        size: '12mb',
        extnames: ['jpg', 'jpeg', 'png', 'doc', 'docx', 'txt', 'pdf'],
      })
    ),
    exam_request: schema.string.optional({}),
    prescription: schema.string.optional({}),
    status: schema.enum.optional(['confirmed', 'pending', 'cancelled']),
    is_private: schema.boolean.optional(),
  })

  public messages = {
    'files.size': 'APPOINTMENT_FILE_MAXIMUM_SIZE_12MB',
    'files.extname': 'APPOINTMENT_FILE_EXTNAME',
    'files.file.size': 'APPOINTMENT_FILE_MAXIMUM_SIZE_12MB',
    'files.file.extname': 'APPOINTMENT_FILE_EXTNAME',
  }
}
