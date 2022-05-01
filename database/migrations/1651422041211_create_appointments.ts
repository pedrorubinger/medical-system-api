import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Appointments extends BaseSchema {
  protected tableName = 'appointments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.datetime('datetime').notNullable()
      table.boolean('is_follow_up').notNullable().defaultTo(false)
      table.datetime('last_appointment_datetime').nullable()
      table.text('notes').nullable()
      table.text('exam_request').nullable()
      table.text('prescription').nullable()
      table
        .enum('status', ['confirmed', 'pending', 'cancelled'])
        .notNullable()
        .defaultTo('pending')
      table.boolean('is_private').notNullable().defaultTo(false)
      table
        .integer('tenant_id')
        .references('id')
        .inTable('tenants')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .unsigned()
        .notNullable()
      table
        .integer('patient_id')
        .unsigned()
        .references('id')
        .inTable('patients')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('doctor_id')
        .unsigned()
        .references('id')
        .inTable('doctors')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('insurance_id')
        .unsigned()
        .references('id')
        .inTable('insurances')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .nullable()
      table
        .integer('specialty_id')
        .unsigned()
        .references('id')
        .inTable('specialties')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .nullable()
      table
        .integer('payment_method_id')
        .unsigned()
        .references('id')
        .inTable('payment_methods')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .nullable()
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
