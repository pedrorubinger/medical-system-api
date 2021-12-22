import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

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

  @column()
  public password: string

  @column()
  public role: TRole

  @column()
  public reset_password_token: string
}
