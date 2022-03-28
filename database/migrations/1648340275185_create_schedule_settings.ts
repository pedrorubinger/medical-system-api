import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ScheduleSettings extends BaseSchema {
  protected tableName = 'schedule_settings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.text('sunday').nullable()
      table.text('monday').nullable()
      table.text('tuesday').nullable()
      table.text('wednesday').nullable()
      table.text('thursday').nullable()
      table.text('friday').nullable()
      table.text('saturday').nullable()
      table
        .integer('doctor_id')
        .unsigned()
        .references('id')
        .inTable('doctors')
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
