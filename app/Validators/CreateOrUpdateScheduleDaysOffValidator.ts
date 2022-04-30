import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateOrUpdateScheduleDaysOffValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    tenant_id: this.ctx.auth.user!.tenant_id,
    doctor_id: this.ctx.auth.user!.doctor!.id,
  })

  public schema = schema.create({
    datetime_start: schema.date({ format: 'yyyy-MM-dd HH:mm' }, [
      rules.unique({
        table: 'schedule_days_off',
        column: 'datetime_start',
        where: {
          tenant_id: this.refs.tenant_id,
          doctor_id: this.refs.doctor_id,
        },
      }),
      rules.beforeField('datetime_end'),
    ]),
    datetime_end: schema.date({ format: 'yyyy-MM-dd HH:mm' }, [
      rules.unique({
        table: 'schedule_days_off',
        column: 'datetime_end',
        where: {
          tenant_id: this.refs.tenant_id,
          doctor_id: this.refs.doctor_id,
        },
      }),
      rules.afterField('datetime_start'),
    ]),
  })

  public messages = {
    'datetime_start.required': 'SCHEDULE_DAYS_OFF_DATETIME_START_IS_REQUIRED',
    'datetime_end.required': 'SCHEDULE_DAYS_OFF_DATETIME_END_IS_REQUIRED',
    'datetime_start.unique': 'SCHEDULE_DAYS_OFF_DATETIME_START_MUST_BE_UNIQUE',
    'datetime_end.unique': 'SCHEDULE_DAYS_OFF_DATETIME_END_MUST_BE_UNIQUE',
    'datetime_start.beforeField':
      'SCHEDULE_DAYS_OFF_DATETIME_START_LESS_THAN_END',
    'datetime_end.afterField':
      'SCHEDULE_DAYS_OFF_DATETIME_END_GREATER_THAN_START',
    'datetime_start.afterOrEqualToField':
      'SCHEDULE_DAYS_OFF_DATETIME_START_BEFORE_NOW',
  }
}
