import {
  column,
  BaseModel,
  BelongsTo,
  belongsTo,
  beforeFetch,
  beforeFind,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Patient from 'App/Models/Patient'
import Tenant from 'App/Models/Tenant'
import Doctor from 'App/Models/Doctor'
import Insurance from 'App/Models/Insurance'
import PaymentMethod from 'App/Models/PaymentMethod'
import Specialty from 'App/Models/Specialty'

type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled'

export default class Appointment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public datetime: DateTime

  @column()
  public is_follow_up: boolean

  @column()
  public last_appointment_datetime?: DateTime

  @column()
  public notes?: string

  @column()
  public exam_request?: string

  @column()
  public status?: AppointmentStatus

  @column()
  public is_private: boolean

  @column({ serializeAs: null })
  public tenant_id: number

  @column()
  public patient_id: number

  @column()
  public doctor_id: number

  @column()
  public insurance_id: number

  @column()
  public specialty_id: number

  @column()
  public payment_method_id: number

  @belongsTo(() => Tenant, { foreignKey: 'tenant_id', serializeAs: null })
  public tenant: BelongsTo<typeof Tenant>

  @belongsTo(() => Doctor, { foreignKey: 'doctor_id' })
  public doctor: BelongsTo<typeof Doctor>

  @belongsTo(() => Patient, { foreignKey: 'patient_id' })
  public patient: BelongsTo<typeof Patient>

  @belongsTo(() => Insurance, { foreignKey: 'insurance_id' })
  public insurance: BelongsTo<typeof Insurance>

  @belongsTo(() => PaymentMethod, { foreignKey: 'payment_method_id' })
  public payment_method: BelongsTo<typeof PaymentMethod>

  @belongsTo(() => Specialty, { foreignKey: 'specialty_id' })
  public specialty: BelongsTo<typeof Specialty>

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @beforeFetch()
  public static async preloadModelsBeforeFetch(
    query: ModelQueryBuilderContract<typeof Appointment>
  ) {
    query.preload('doctor')
    query.preload('insurance')
    query.preload('patient')
    query.preload('specialty')
    query.preload('payment_method')
  }

  @beforeFind()
  public static async preloadModelsBeforeFind(
    query: ModelQueryBuilderContract<typeof Appointment>
  ) {
    await query.preload('doctor')
    await query.preload('insurance')
    await query.preload('patient')
    await query.preload('specialty')
    await query.preload('payment_method')
  }
}
