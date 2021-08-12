import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext"
import {schema, rules} from "@ioc:Adonis/Core/Validator"
import Hash from "@ioc:Adonis/Core/Hash"
import User from "App/Models/User"
import {DateTime} from "luxon"
import {UserAuth} from "App/Controllers/Http/Interfaces/UserAuth"

import RegisterRules from "App/Controllers/Http/Rules/RegisterRules"
import LoginRules from "App/Controllers/Http/Rules/LoginRules"

export default class AuthController {
  public async register({request, response}: HttpContextContract) {
    let data = {}
    try {
      data = await request.validate(RegisterRules)
    } catch (error) {
      const errors = error.messages.errors ?? []
      return response.notAcceptable(errors)
    }
    console.log({data})
    const user = await User.create(data)
    await user?.sendVerificationEmail()
    return response.created(user)
  }

  public async sendMailConfirmation({request, response}: HttpContextContract) {
    const schemas = schema.create({
      email: schema.string({}, [rules.email()]),
    })

    const data = await request.validate({schema: schemas})

    // Lookup user manually
    const user = await User.query()
      .where("email", data.email)
      .andWhere("active", true)
      .firstOrFail()

    user?.sendVerificationEmail()

    return response.accepted(user)
  }

  public async verifyAccount({request, response}: HttpContextContract) {
    const {id, mailToken} = await request.body()
    const user = await User.findOrFail(id)
    const saved = await user?.saveEmailVerifyAt(mailToken)
    const {name, email, emailVerifiedAt: verifiedAt} = user
    const emailVerifiedAt = verifiedAt?.setLocale("pt-br").toLocaleString(DateTime.DATETIME_SHORT)
    return response.accepted({id, name, email, emailVerifiedAt, saved})
  }

  public async login({request, response, auth}: HttpContextContract) {
    const {email: login, password} = await request.validate(LoginRules)

    const user = await User.query().where("email", login).andWhere("active", true).firstOrFail()

    if (!(await Hash.verify(user.password, password))) {
      const status = 400
      const message = "Acesso Negado! Credenciais inválidas"
      return response.badRequest({status, message})
    }

    if (user.emailVerifiedAt === null) {
      user.sendVerificationEmail()
      const status = 400
      const message = `
        Sua conta não está habilitada!
        Abra sua caixa de correio e faça a verificação.
        `
      return response.badRequest({status, message})
    }
    const {token, cpf, name, email} = (await user.generateToken(auth)) as UserAuth
    response.created({token, cpf, name, email} as UserAuth)
  }
}
