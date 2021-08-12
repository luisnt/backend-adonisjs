import BaseSchema from "@ioc:Adonis/Lucid/Schema"

export default class RequestedCards extends BaseSchema {
  protected tableName = "requested_cards"

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements("id")

      table.bigInteger('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').unique()

      table.date("birth")
      table.string("sex")
      
      table.string("address_cep")
      table.string("address_road")
      table.string("address_number")
      table.string("address_complement")
      table.string("address_district")
      table.string("address_city")
      table.string("address_state")

      table.timestamp("created_at", {useTz: true})
      table.timestamp("updated_at", {useTz: true})
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
