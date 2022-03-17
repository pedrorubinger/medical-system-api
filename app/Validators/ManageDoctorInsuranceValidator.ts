import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ManageDoctorInsuranceValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    flag: schema.enum(['attach', 'dettach']),
    insurances: schema
      .array()
      .members(
        schema
          .object()
          .members({ insurance_id: schema.number(), price: schema.number() })
      ),
  })

  public messages = {
    'flag.required': 'MANAGE_DOCTOR_INSURANCE_FLAG_IS_REQUIRED',
    'insurances.required': 'MANAGE_DOCTOR_INSURANCE_IS_REQUIRED',
  }
}
