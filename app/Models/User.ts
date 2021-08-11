import Env from '@ioc:Adonis/Core/Env'
import Hash from '@ioc:Adonis/Core/Hash'
import Mail from '@ioc:Adonis/Addons/Mail'
import Database from '@ioc:Adonis/Lucid/Database'
import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { nanoid } from 'nanoid'


export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public cpf: string

  @column()
  public email: string

  @column()
  public emailVerifiedAt?: DateTime

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column()
  public active: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(users: User) {
    if (users.$dirty.password) {
      users.password = await Hash.make(users.password)
    }
    users.cpf = await users?.cpf?.replace(/[^0-9]+/g,"")
  }

  public async clearOldTokens() {
    Database.raw(`DELETE FROM tokens WHERE user_id=${this.id}`)
  }

  public async sendVerificationEmail() {
    this.rememberMeToken = nanoid()
    await this.save()
    const url = `${Env.get('APP_URL')}/verify/${this.id}/${this.rememberMeToken}`
    await Mail.send((message) => {
      message
        .from('verify@no-response-this-mail.com')
        .to(this.email)
        .subject('Por favor confirme seu email!')
        .htmlView('emails/verify', { user: this, url })
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

}
