import {
  column,
  BaseModel,
  ManyToMany,
  manyToMany,
  belongsTo,
  BelongsTo,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Doctor from 'App/Models/Doctor'
import Tenant from 'App/Models/Tenant'

export default class Specialty extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column({ serializeAs: null })
  public tenant_id: number

  @belongsTo(() => Tenant, { foreignKey: 'tenant_id' })
  public tenant: BelongsTo<typeof Tenant>

  @manyToMany(() => Doctor, {
    localKey: 'id',
    pivotForeignKey: 'specialty_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'doctor_id',
    pivotTable: 'doctors_specialties',
  })
  public doctor: ManyToMany<typeof Doctor>

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
}
