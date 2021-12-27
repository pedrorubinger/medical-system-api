import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 100).notNullable()
      table.string('email', 80).notNullable().unique()
      table.string('cpf', 20).notNullable().unique()
      table.string('phone', 40).notNullable()
      table.boolean('is_admin').notNullable().defaultTo(false)
      table.string('password', 255).notNullable()
      table.enum('role', ['manager', 'doctor'])
      table.string('reset_password_token', 255).nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
