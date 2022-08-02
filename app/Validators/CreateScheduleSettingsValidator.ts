import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateScheduleSettingsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    doctor_id: schema.number(),
    sunday: schema.object.optional().members({
      times: schema.array().members(schema.string()),
    }),
    monday: schema.object.optional().members({
      times: schema.array().members(schema.string()),
    }),
    tuesday: schema.object.optional().members({
      times: schema.array().members(schema.string()),
    }),
    wednesday: schema.object.optional().members({
      times: schema.array().members(schema.string()),
    }),
    thursday: schema.object.optional().members({
      times: schema.array().members(schema.string()),
    }),
    friday: schema.object.optional().members({
      times: schema.array().members(schema.string()),
    }),
    saturday: schema.object.optional().members({
      times: schema.array().members(schema.string()),
    }),
  })

  public messages = {
    'doctor_id.required': 'DOCTOR_ID_IS_REQUIRED',
  }
}
