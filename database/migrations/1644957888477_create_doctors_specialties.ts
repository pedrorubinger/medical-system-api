import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DoctorsSpecialties extends BaseSchema {
  protected tableName = 'doctors_specialties'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('doctor_id')
        .unsigned()
        .references('id')
        .inTable('doctors')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('specialty_id')
        .unsigned()
        .references('id')
        .inTable('specialties')
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
