import {
  column,
  beforeSave,
  BaseModel,
  hasOne,
  HasOne,
  ModelQueryBuilderContract,
  beforeFind,
  belongsTo,
  BelongsTo,
  beforeFetch,
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import { DateTime } from 'luxon'

import Doctor from 'App/Models/Doctor'
import Tenant from 'App/Models/Tenant'

export type Role = 'manager' | 'doctor' | 'developer'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column({ serializeAs: null })
  public tenant_id: number

  @column()
  public email: string

  @column()
  public phone: string

  @column()
  public cpf: string

  @column()
  public is_admin: boolean

  @column()
  public is_clinic_owner: boolean

  @column()
  public is_master: boolean

  @column({ serializeAs: null })
  public password: string | undefined

  @column()
  public role: Role

  @column({ serializeAs: null })
  public reset_password_token: string | null

  @hasOne(() => Doctor, { foreignKey: 'user_id' })
  public doctor: HasOne<typeof Doctor>

  @belongsTo(() => Tenant, { foreignKey: 'tenant_id', serializeAs: null })
  public tenant: BelongsTo<typeof Tenant>

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.password && user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @beforeFetch()
  public static async preloadModelsBeforeFetch(
    query: ModelQueryBuilderContract<typeof User>
  ) {
    query.preload('tenant')
    query.preload('doctor', (builder) => {
      builder.preload('schedule_settings')
      builder.preload('insurance', (insuranceBuilder) => {
        insuranceBuilder.pivotColumns(['price'])
      })
      builder.preload('specialty')
      builder.preload('payment_method')
    })
  }

  @beforeFind()
  public static async preloadModelsBeforeFind(
    query: ModelQueryBuilderContract<typeof User>
  ) {
    await query.preload('tenant')
    await query.preload('doctor', (builder) => {
      builder.preload('schedule_settings')
      builder.preload('insurance', (insuranceBuilder) => {
        insuranceBuilder.pivotColumns(['price'])
      })
      builder.preload('specialty')
      builder.preload('payment_method')
    })
  }
}
