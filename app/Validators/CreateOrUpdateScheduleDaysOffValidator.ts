import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateOrUpdateScheduleDaysOffValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    datetime_start: schema.date(),
    datetime_end: schema.date(),
  })

  public messages = {
    'datetime_start.required': 'DATETIME_START_IS_REQUIRED',
    'datetime_end.required': 'DATETIME_END_IS_REQUIRED',
  }
}
