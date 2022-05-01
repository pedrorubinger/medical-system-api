import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Patients extends BaseSchema {
  protected tableName = 'patients'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 150).notNullable()
      table.string('cpf', 20).notNullable().unique()
      table.date('birthdate').notNullable()
      table.string('primary_phone', 30).notNullable()
      table.string('mother_name', 150).notNullable()
      table.string('father_name', 150).nullable()
      table.string('secondary_phone', 30).nullable()
      table.string('email', 80).nullable().unique()
      table
        .integer('tenant_id')
        .references('id')
        .inTable('tenants')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .unsigned()
        .notNullable()
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
