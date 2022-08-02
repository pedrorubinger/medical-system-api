import {
  belongsTo,
  column,
  BelongsTo,
  BaseModel,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Tenant from 'App/Models/Tenant'
import Doctor from 'App/Models/Doctor'

export default class PaymentMethod extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column({ serializeAs: null })
  public tenant_id: number

  @belongsTo(() => Tenant, { foreignKey: 'tenant_id', serializeAs: null })
  public tenant: BelongsTo<typeof Tenant>

  @manyToMany(() => Doctor, {
    localKey: 'id',
    pivotForeignKey: 'payment_method_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'doctor_id',
    pivotTable: 'doctors_payment_methods',
  })
  public doctor: ManyToMany<typeof Doctor>

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
}
