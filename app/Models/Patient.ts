import {
  column,
  BaseModel,
  BelongsTo,
  belongsTo,
  beforeFetch,
  beforeFind,
  ModelQueryBuilderContract,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Address from 'App/Models/Address'
import Tenant from 'App/Models/Tenant'
import Appointment from 'App/Models/Appointment'

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

  @column({ serializeAs: null })
  public tenant_id: number

  @hasOne(() => Address, { foreignKey: 'patient_id' })
  public address: HasOne<typeof Address>

  @hasOne(() => Appointment, { foreignKey: 'patient_id' })
  public appointment: HasOne<typeof Appointment>

  @belongsTo(() => Tenant, { foreignKey: 'tenant_id', serializeAs: null })
  public tenant: BelongsTo<typeof Tenant>

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @beforeFetch()
  public static async preloadModelsBeforeFetch(
    query: ModelQueryBuilderContract<typeof Patient>
  ) {
    query.preload('address')
    query.preload('appointment')
  }

  @beforeFind()
  public static async preloadModelsBeforeFind(
    query: ModelQueryBuilderContract<typeof Patient>
  ) {
    await query.preload('address')
  }
}
