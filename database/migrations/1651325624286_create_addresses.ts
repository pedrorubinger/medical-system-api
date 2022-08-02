import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Creates extends BaseSchema {
  protected tableName = 'addresses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('street', 80).notNullable()
      table.string('number', 10).notNullable()
      table.string('neighborhood', 50).notNullable()
      table.string('postal_code', 15).notNullable()
      table.string('complement', 50).nullable()
      table
        .integer('patient_id')
        .references('id')
        .inTable('patients')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .unsigned()
        .notNullable()
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
