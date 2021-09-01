import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlterUsersAddColumnPhone extends BaseSchema {
  protected tableName = 'requested_cards'
  protected columnName = 'phone'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.string(this.columnName).nullable()
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn(this.columnName)
    })
  }
}
