import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreateDoctors extends BaseSchema {
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
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
