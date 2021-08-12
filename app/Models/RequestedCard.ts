import {DateTime} from "luxon"
import {BaseModel, column} from "@ioc:Adonis/Lucid/Orm"

export default class RequestedCard extends BaseModel {
  @column({isPrimary: true})
  public id: number

  @column()
  public user_id: string

  @column()
  public birth: Date

  @column()
  public sex: string

  @column()
  public address_cep: string

  @column()
  public address_road: string

  @column()
  public address_number: string

  @column()
  public address_complement: string

  @column()
  public address_district: string

  @column()
  public address_city: string

  @column()
  public address_state: string

  @column.dateTime({autoCreate: true})
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updatedAt: DateTime
}
