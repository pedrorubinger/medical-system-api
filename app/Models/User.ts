import {
  column,
  beforeSave,
  BaseModel,
  hasOne,
  HasOne,
  ModelQueryBuilderContract,
  beforeFind,
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import { DateTime } from 'luxon'

import Doctor from 'App/Models/Doctor'

export type TRole = 'manager' | 'doctor'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public phone: string

  @column()
  public cpf: string

  @column()
  public is_admin: boolean

  @column({ serializeAs: null })
  public password: string | undefined

  @column()
  public role: TRole

  @column({ serializeAs: null })
  public reset_password_token: string | null

  @hasOne(() => Doctor, { foreignKey: 'user_id' })
  public doctor: HasOne<typeof Doctor>

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @beforeSave()
  public static async hashPassword(auth: User) {
    if (auth.password && auth.$dirty.password) {
      auth.password = await Hash.make(auth.password)
    }
  }

  @beforeFind()
  public static async preloadDoctorBeforeFind(
    query: ModelQueryBuilderContract<typeof User>
  ) {
    await query.preload('doctor', (builder) => {
      builder.preload('insurance')
      builder.preload('specialty')
    })
  }
}
