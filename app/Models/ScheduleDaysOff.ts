import { column, BaseModel, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Doctor from 'App/Models/Doctor'
import Tenant from 'App/Models/Tenant'

export default class ScheduleDaysOff extends BaseModel {
  public static table = 'schedule_days_off'

  @column({ isPrimary: true })
  public id: number

  @column()
  public datetime_start: DateTime

  @column()
  public datetime_end: DateTime

  @column()
  public doctor_id: number

  @column({ serializeAs: null })
  public tenant_id: number

  @belongsTo(() => Tenant, { foreignKey: 'tenant_id', serializeAs: null })
  public tenant: BelongsTo<typeof Tenant>

  @belongsTo(() => Doctor, { foreignKey: 'doctor_id' })
  public doctor: BelongsTo<typeof Doctor>

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
}
