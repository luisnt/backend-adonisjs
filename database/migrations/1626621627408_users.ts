import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()
      table.string('name', 96).notNullable()
      table.string("cpf", 14).notNullable().unique()
      table.string('email', 255).notNullable().unique()
      table.dateTime('email_verified_at').nullable()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()
      table.boolean("active").defaultTo(true)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
