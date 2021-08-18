import Env from "@ioc:Adonis/Core/Env"
import Hash from "@ioc:Adonis/Core/Hash"
import Mail from "@ioc:Adonis/Addons/Mail"
import Database from "@ioc:Adonis/Lucid/Database"
import {column, beforeSave, BaseModel} from "@ioc:Adonis/Lucid/Orm"
import {DateTime} from "luxon"
import {nanoid} from "nanoid"
import {base64} from "@ioc:Adonis/Core/Helpers"
import {AuthContract} from "@ioc:Adonis/Addons/Auth"

export default class User extends BaseModel {
  @column({isPrimary: true})
  public id: number

  @column()
  public name: string

  @column()
  public cpf: string

  @column()
  public email: string

  @column()
  public emailVerifiedAt?: DateTime

  @column({serializeAs: null})
  public password: string

  @column()
  public rememberMeToken?: string | null

  @column()
  public active: boolean

  @column.dateTime({autoCreate: true})
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(users: User) {
    if (users.$dirty.password) {
      users.password = await Hash.make(users.password)
    }
  }

  public static async extractTokenID(auth: any): Promise<number> {
    const {
      token: {userId},
    } = auth.use("api")
    return +userId
  }

  public async generateToken(auth: AuthContract) {
    await this.clearOldTokens()
    const {type, token: value} = await auth.use("api").generate(this, {expiresIn: "30mins"})
    const updatedToken = await this.synchronizeTokenID(value)
    const token = `${type} ${updatedToken}`
    const {cpf, name, email} = this
    return {token, cpf, name, email}
  }

  private async clearOldTokens() {
    const sqlClearOldTokens = `DELETE FROM tokens WHERE user_id=${this.id}`
    await Database.rawQuery(sqlClearOldTokens)
  }

  private async synchronizeTokenID(token: string) {
    const sqlSynchronizeTokenID = `UPDATE tokens SET id=${this.id} WHERE user_id=${this.id}`
    await Database.rawQuery(sqlSynchronizeTokenID)
    let [id, value] = token.split(".")
    id = base64.urlEncode(`${this.id}`)
    const updatedToken = `${id}.${value}`
    return updatedToken
  }

  public async sendVerificationEmail() {
    this.rememberMeToken = nanoid()
    await this.save()
    const url = `${Env.get("APP_URL")}/verify/${this.id}/${this.rememberMeToken}`
    await Mail.sendLater((message) => {
      message
        .from("verify@no-response-this-mail.com")
        .to(this.email)
        .subject("Por favor confirme seu email!")
        .htmlView("emails/verify", {user: this, url})
    })
  }

  public async saveEmailVerifyAt(mailToken: string) {
    if (this.rememberMeToken === mailToken) {
      this.emailVerifiedAt = DateTime.now()
      this.rememberMeToken = undefined
      await this.save()
      return true
    }
    return false
  }

  public async sendEmailPasswordReset() {
    this.rememberMeToken = nanoid()
    await this.save()
    const url = `${Env.get("APP_URL")}/reset/${this.id}/${this.rememberMeToken}`
    await Mail.sendLater((message) => {
      message
        .from("verify@no-response-this-mail.com")
        .to(this.email)
        .subject("Solicitação de redefinição da senha!")
        .htmlView("emails/reset", {user: this, url})
    })
  }
}
