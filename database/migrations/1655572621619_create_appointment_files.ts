import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AppointmentFiles extends BaseSchema {
  protected tableName = 'appointment_files'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.text('file_url').notNullable()
      table.string('file_path', 600).notNullable().unique()
      table.string('file_name', 250).notNullable()
      table
        .integer('appointment_id')
        .unsigned()
        .references('id')
        .inTable('appointments')
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
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
