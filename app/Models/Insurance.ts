import {
  column,
  BaseModel,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Doctor from 'App/Models/Doctor'

export default class Insurance extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @manyToMany(() => Doctor, {
    localKey: 'id',
    pivotForeignKey: 'insurance_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'doctor_id',
    pivotTable: 'doctors_insurances',
  })
  public doctor: ManyToMany<typeof Doctor>

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
}
