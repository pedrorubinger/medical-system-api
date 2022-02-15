import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DoctorsInsurances extends BaseSchema {
  protected tableName = 'doctors_insurances'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.decimal('price', 8, 2).notNullable()
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
        .onDelete('CASCADE')
        .notNullable()
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
