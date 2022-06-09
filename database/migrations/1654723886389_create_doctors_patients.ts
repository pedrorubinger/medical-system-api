import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DoctorsPatients extends BaseSchema {
  protected tableName = 'doctors_patients'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.decimal('weight', 10, 2).nullable()
      table.decimal('height', 10, 2).nullable()
      table.text('allergies').nullable()
      table.text('illnesses').nullable()
      table.text('notes').nullable()
      table
        .integer('doctor_id')
        .unsigned()
        .references('id')
        .inTable('doctors')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
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
