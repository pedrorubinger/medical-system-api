import { column, BaseModel, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Doctor from 'App/Models/Doctor'
import User from 'App/Models/User'
import Specialty from 'App/Models/Specialty'
import Insurance from 'App/Models/Insurance'

export default class Tenant extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public is_active: boolean

  @hasOne(() => Doctor, { foreignKey: 'tenant_id' })
  public doctor: HasOne<typeof Doctor>

  @hasOne(() => User, { foreignKey: 'tenant_id' })
  public user: HasOne<typeof User>

  @hasOne(() => Specialty, { foreignKey: 'tenant_id' })
  public specialty: HasOne<typeof Specialty>

  @hasOne(() => Insurance, { foreignKey: 'tenant_id' })
  public insurance: HasOne<typeof Insurance>

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
}
