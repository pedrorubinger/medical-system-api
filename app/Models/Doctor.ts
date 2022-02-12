import {
  belongsTo,
  column,
  BelongsTo,
  BaseModel,
  beforeFetch,
  beforeFind,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import User from 'App/Models/User'

export default class Doctor extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public crm_document: string

  @column()
  public user_id: number

  @belongsTo(() => User, { foreignKey: 'user_id' })
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @beforeFetch()
  public static joinAddressOnFetch(
    query: ModelQueryBuilderContract<typeof Doctor>
  ) {
    query.preload('user')
  }

  @beforeFind()
  public static joinAddressOnFind(
    query: ModelQueryBuilderContract<typeof Doctor>
  ) {
    query.preload('user')
  }
}
