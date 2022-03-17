import {
  belongsTo,
  column,
  BelongsTo,
  BaseModel,
  manyToMany,
  ManyToMany,
  beforeFind,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import User from 'App/Models/User'
import Insurance from 'App/Models/Insurance'
import Specialty from 'App/Models/Specialty'
import Tenant from 'App/Models/Tenant'

export interface DoctorAttributes {
  id?: number
  user_id: number
  crm_document: string
  created_at?: DateTime
  updated_at?: DateTime
}

export default class Doctor extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public crm_document: string

  @column()
  public user_id: number

  @column()
  public tenant_id: number

  @belongsTo(() => User, { foreignKey: 'user_id' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Tenant, { foreignKey: 'tenant_id' })
  public tenant: BelongsTo<typeof Tenant>

  @manyToMany(() => Insurance, {
    localKey: 'id',
    pivotForeignKey: 'doctor_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'insurance_id',
    pivotTable: 'doctors_insurances',
  })
  public insurance: ManyToMany<typeof Insurance>

  @manyToMany(() => Specialty, {
    localKey: 'id',
    pivotForeignKey: 'doctor_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'specialty_id',
    pivotTable: 'doctors_specialties',
  })
  public specialty: ManyToMany<typeof Specialty>

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @beforeFind()
  public static async preloadSpecialtiesBeforeFind(
    query: ModelQueryBuilderContract<typeof Doctor>
  ) {
    await query.preload('specialty')
  }

  @beforeFind()
  public static async preloadInsurancesBeforeFind(
    query: ModelQueryBuilderContract<typeof Doctor>
  ) {
    await query.preload('insurance', (builder) => {
      builder.pivotColumns(['price'])
    })
  }
}
