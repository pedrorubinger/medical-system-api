import {
  belongsTo,
  column,
  BelongsTo,
  BaseModel,
  manyToMany,
  ManyToMany,
  beforeFind,
  ModelQueryBuilderContract,
  HasOne,
  hasOne,
  HasMany,
  hasMany,
  beforeFetch,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import User from 'App/Models/User'
import Insurance from 'App/Models/Insurance'
import Specialty from 'App/Models/Specialty'
import Tenant from 'App/Models/Tenant'
import PaymentMethod from 'App/Models/PaymentMethod'
import ScheduleSettings from 'App/Models/ScheduleSettings'
import ScheduleDaysOff from 'App/Models/ScheduleDaysOff'
import Appointment from 'App/Models/Appointment'
import Patient from 'App/Models/Patient'

export interface DoctorAttributes {
  id?: number
  user_id: number
  crm_document: string
  created_at?: DateTime
  updated_at?: DateTime
  private_appointment_price?: number
  appointment_follow_up_limit?: number
}

export default class Doctor extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public crm_document: string

  @column()
  public private_appointment_price: number

  @column()
  public appointment_follow_up_limit: number

  @column()
  public user_id: number

  @column({ serializeAs: null })
  public tenant_id: number

  @belongsTo(() => User, { foreignKey: 'user_id', serializeAs: null })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Tenant, { foreignKey: 'tenant_id', serializeAs: null })
  public tenant: BelongsTo<typeof Tenant>

  @hasOne(() => ScheduleSettings, { foreignKey: 'doctor_id' })
  public schedule_settings: HasOne<typeof ScheduleSettings>

  @hasMany(() => ScheduleDaysOff, { foreignKey: 'doctor_id' })
  public schedule_days_off: HasMany<typeof ScheduleDaysOff>

  @hasOne(() => Appointment, { foreignKey: 'doctor_id' })
  public appointment: HasOne<typeof Appointment>

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

  @manyToMany(() => PaymentMethod, {
    localKey: 'id',
    pivotForeignKey: 'doctor_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'payment_method_id',
    pivotTable: 'doctors_payment_methods',
  })
  public payment_method: ManyToMany<typeof PaymentMethod>

  @manyToMany(() => Patient, {
    localKey: 'id',
    pivotForeignKey: 'doctor_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'patient_id',
    pivotTable: 'doctors_patients',
    pivotColumns: ['weight', 'height', 'allergies', 'illnesses', 'notes'],
  })
  public patient: ManyToMany<typeof Patient>

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @beforeFetch()
  public static async preloadRelationsBeforeFetch(
    query: ModelQueryBuilderContract<typeof Doctor>
  ) {
    query.preload('schedule_days_off')
  }

  @beforeFind()
  public static async preloadRelationsBeforeFind(
    query: ModelQueryBuilderContract<typeof Doctor>
  ) {
    await query.preload('specialty')
    await query.preload('payment_method')
    await query.preload('schedule_settings')
    await query.preload('insurance', (builder) => {
      builder.pivotColumns(['price'])
    })
  }
}
