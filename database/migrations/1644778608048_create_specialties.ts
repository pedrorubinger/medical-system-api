import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Specialties extends BaseSchema {
  protected tableName = 'specialties'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 80).notNullable().unique()
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
