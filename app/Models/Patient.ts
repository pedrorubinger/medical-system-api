import { column, BaseModel, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Address from 'App/Models/Address'
import Tenant from 'App/Models/Tenant'

export default class Patient extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public cpf: string

  @column()
  public birthdate: Date

  @column()
  public primary_phone: string

  @column()
  public mother_name: string

  @column()
  public father_name?: string

  @column()
  public secondary_phone?: string

  @column()
  public email?: string

  @column()
  public address_id?: number

  @column({ serializeAs: null })
  public tenant_id: number

  @belongsTo(() => Address, { foreignKey: 'address_id' })
  public address: BelongsTo<typeof Address>

  @belongsTo(() => Tenant, { foreignKey: 'tenant_id', serializeAs: null })
  public tenant: BelongsTo<typeof Tenant>

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
}
