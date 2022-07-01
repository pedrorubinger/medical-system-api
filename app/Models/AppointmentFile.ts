import { column, BaseModel, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Tenant from 'App/Models/Tenant'
import Appointment from 'App/Models/Appointment'

export default class AppointmentFile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public file_url: string

  @column()
  public file_name: string

  @column()
  public file_path: string

  @column({ serializeAs: null })
  public tenant_id: number

  @column()
  public appointment_id: number

  @belongsTo(() => Tenant, { foreignKey: 'tenant_id', serializeAs: null })
  public tenant: BelongsTo<typeof Tenant>

  @belongsTo(() => Appointment, { foreignKey: 'appointment_id' })
  public appointment: BelongsTo<typeof Appointment>

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
}
