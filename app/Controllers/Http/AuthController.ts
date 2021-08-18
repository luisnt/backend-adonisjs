import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext"
import Hash from "@ioc:Adonis/Core/Hash"
import {DateTime} from "luxon"
import {base64} from "@ioc:Adonis/Core/Helpers"

import {UserAuth} from "App/Controllers/Http/Interfaces/UserAuth"
import User from "App/Models/User"

import RegisterRules from "App/Controllers/Http/Rules/RegisterRules"
import LoginRules from "App/Controllers/Http/Rules/LoginRules"
import PasswordResetRules from "./Rules/PasswordResetRules"
import PasswordChangeRules from "./Rules/PasswordChangeRules"
// import Database from "@ioc:Adonis/Lucid/Database"

export default class AuthController {
  public async register({request, response}: HttpContextContract) {
    //await Database.rawQuery(`delete from public.users`).exec()
    let data: any
    try {
      data = await request.validate(RegisterRules)
    } catch (error) {
      const errors = error.messages.errors ?? []
      return response.notAcceptable(errors)
    }

    const user = await User.create(data)
    await user?.sendVerificationEmail()
    const {email} = user

    const message = `
      Uma confirmação foi enviada ao email <i>${email}</i>.<br /><br />
      <b>Siga as instruções:</b><br />
      <span>1º - Acesse o email <b>${email}</b></span><br />
      <span>2º - No corpo do email clique no botão </span><br />
      <br />
      <span><a>Confirme seu email aqui</a>.</span>
      <br /><br />
    `

    return response.created(message)
  }

  // public async sendMailConfirmation({request, response}: HttpContextContract) {
  //   const schemas = schema.create({
  //     email: schema.string({}, [rules.email()]),
  //   })

  //   const data = await request.validate({schema: schemas})

  //   // Lookup user manually
  //   const user = await User.query()
  //     .where("email", data.email)
  //     .andWhere("active", true)
  //     .firstOrFail()

  //   user?.sendVerificationEmail()

  //   return response.accepted(user)
  // }

  public async verifyAccount({request, response}: HttpContextContract) {
    const {id, mailToken} = await request.body()
    const user = await User.findOrFail(id)
    await user?.saveEmailVerifyAt(mailToken)
    const {name, email, emailVerifiedAt: verifiedAt} = user
    const emailVerifiedAt = verifiedAt?.setLocale("pt-br").toLocaleString(DateTime.DATETIME_SHORT)

    const message = `
      O Acesso do usuário <span>${name} </span>
      foi confirmado para o email <span>${email} </span>
      em <span>${emailVerifiedAt} </span><br />
      Prossiga para o login clicando no botão abaixo
      <p />
      <a href="/">Ir para o login</a>
    `
    console.log({message})

    return response.accepted(message)
  }

  public async login({request, response, auth}: HttpContextContract) {
    const {email: login, password} = await request.validate(LoginRules)

    const user = await User.query().where("email", login).andWhere("active", true).first()

    if (!user) {
      const message = "Credenciais inválidas"
      return response.notAcceptable(message)
    }

    if (!(await Hash.verify(user.password, password))) {
      const message = "Credenciais inválidas"
      return response.notAcceptable(message)
    }

    if (user.emailVerifiedAt === null) {
      user.sendVerificationEmail()
      const message = `
        Sua conta não está habilitada!
        Abra sua caixa de correio e faça a verificação.
        `
      return response.forbidden(message)
    }
    const {token, cpf, name, email} = (await user.generateToken(auth)) as UserAuth
    return response.created({token, cpf, name, email} as UserAuth)
  }

  public async logout({response, auth}: HttpContextContract) {
    await auth.logout()
    return response.noContent()
  }

  public async passwordReset({request, response}: HttpContextContract) {
    const {email: login} = await request.validate(PasswordResetRules)

    const user = await User.query().where("email", login).andWhere("active", true).firstOrFail()

    user.sendEmailPasswordReset()

    const [, caixa] = login.split("@")
    const message = `
      <p>Um email foi enviado para ${login} com uma solicitação de mudança da senha.</p>
      <p>Abra a caixa de correio para continuar.</p>
      <p><a href="https://www.${caixa}" target="_blank">www.${caixa}</a></p>
    `
    return response.accepted(message)
  }

  public async passwordChange({request, response}: HttpContextContract) {
    const {id, token, key, password} = await request.validate(PasswordChangeRules)

    const mailKey = `${base64.urlEncode(id)}.${base64.urlEncode(token)}`

    if (!(key === mailKey)) {
      const message = `
      <p>Sua autenticação provisória expirou.</p>
      <p>Acesso Negado!</p>
      `
      return response.unprocessableEntity(message)
    }

    const rememberMeToken = null
    const user = await User.query()
      .where("id", id)
      .andWhere("active", true)
      .andWhere("remember_me_token", token)
      .andWhereNotNull("emailVerifiedAt")
      .andWhereNotNull("remember_me_token")
      .first()

    if (!user) {
      const message = `
      <p>Sua autenticação provisória expirou.</p>
      <p>Acesso Negado!</p>
      `
      return response.unprocessableEntity(message)
    }

    user.merge({password, rememberMeToken})
    await user.save()

    const message = "A senha da sua conta foi alterada com sucesso."
    return response.accepted(message)
  }
}
