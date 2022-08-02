import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Doctors extends BaseSchema {
  protected tableName = 'doctors'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('crm_document', 20).notNullable().unique()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('tenant_id')
        .unsigned()
        .references('id')
        .inTable('tenants')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table
        .decimal('private_appointment_price', 8, 2)
        .notNullable()
        .defaultTo(0)
      table.integer('appointment_follow_up_limit').notNullable().defaultTo(15)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
