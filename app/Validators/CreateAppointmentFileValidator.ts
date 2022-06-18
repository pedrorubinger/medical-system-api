import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateAppointmentFileValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    appointment_id: schema.number(),
    file: schema.file({
      size: '12mb',
      extnames: ['jpg', 'jpeg', 'png', 'doc', 'docx', 'txt', 'pdf'],
    }),
  })

  public messages = {
    'appointment_id.required': 'APPOINTMENT_IS_REQUIRED',
    'file.required': 'APPOINTMENT_FILE_IS_REQUIRED',
    'file.size': 'APPOINTMENT_FILE_MAXIMUM_SIZE_12MB',
    'file.extname': 'APPOINTMENT_FILE_EXTNAME',
  }
}
