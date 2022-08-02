import { column, BaseModel, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Tenant from 'App/Models/Tenant'
import Patient from 'App/Models/Patient'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public street: string

  @column()
  public number: string

  @column()
  public neighborhood: string

  @column()
  public postal_code: string

  @column()
  public complement?: string

  @column()
  public patient_id: number

  @column({ serializeAs: null })
  public tenant_id: number

  @belongsTo(() => Tenant, { foreignKey: 'tenant_id', serializeAs: null })
  public tenant: BelongsTo<typeof Tenant>

  @belongsTo(() => Patient, { foreignKey: 'patient_id' })
  public patient: BelongsTo<typeof Patient>

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
}
