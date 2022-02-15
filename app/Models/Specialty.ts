import {
  column,
  BaseModel,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Doctor from 'App/Models/Doctor'

export default class Specialty extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

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
