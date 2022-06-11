import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DoctorsPaymentMethods extends BaseSchema {
  protected tableName = 'doctors_payment_methods'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.primary(['doctor_id', 'payment_method_id'])
      table
        .integer('doctor_id')
        .unsigned()
        .references('id')
        .inTable('doctors')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('payment_method_id')
        .unsigned()
        .references('id')
        .inTable('payment_methods')
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
