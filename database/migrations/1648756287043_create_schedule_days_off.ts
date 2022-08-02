import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ScheduleDaysOff extends BaseSchema {
  protected tableName = 'schedule_days_off'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.datetime('datetime_start').notNullable()
      table.datetime('datetime_end').notNullable()
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
