import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext"
import {schema, rules} from "@ioc:Adonis/Core/Validator"
import Hash from "@ioc:Adonis/Core/Hash"
import User from "App/Models/User"
import {DateTime} from "luxon"

export default class AuthController {
  public async register({request, response}: HttpContextContract) {
    const schemas = schema.create({
      name: schema.string({}, [rules.required()]),
      cpf: schema.string({}, [rules.required(), rules.unique({table: "users", column: "cpf"})]),
      email: schema.string({}, [
        rules.required(),
        rules.email(),
        rules.unique({table: "users", column: "email"}),
      ]),
      password: schema.string({}, [rules.required(), rules.confirmed()]),
    })
    let data = {}
    try {
      data = await request.validate({
        schema: schemas,
        messages: {
          "name.required": "Informe um valor para o campo NOME.",
          "cpf.required": "Informe um valor para o campo CPF.",
          "cpf.unique": "CPF já utilizado.",
          "email.required": "Informe um valor para o campo E-MAIL.",
          "email.email": "Informe um email válido.",
          "email.unique": "Email já utilizado.",
          "password.required": "Informe um valor para o campo SENHA.",
          "password.confirmed": "A confirmação deve ser igual a senha.",
        },
      })
    } catch (error) {
      const errors = error.messages.errors ?? []
      return response.notAcceptable(errors)
    }

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
    const {id, mailToken} = await request.all()

    console.log({id, mailToken})

    const user = await User.findOrFail(id)

    const saved = await user?.saveEmailVerifyAt(mailToken)
    const {name, email, emailVerifiedAt} = user

    const body = {
      id,
      name,
      email,
      emailVerifiedAt: emailVerifiedAt?.setLocale("pt-br").toLocaleString(DateTime.DATETIME_SHORT), //toLocal().toSQL({includeOffset: false}),
      saved,
    }

    console.log({...body})
    return response.accepted(body)
  }

  public async login({request, response, auth}: HttpContextContract) {
    const schemas = schema.create({
      email: schema.string({}, [rules.required(), rules.email()]),
      password: schema.string({}, [rules.required()]),
    })
    const {email, password} = await request.validate({schema: schemas})

    // Lookup user manually
    const user = await User.query().where("email", email).andWhere("active", true).firstOrFail()

    // Verify password
    if (!(await Hash.verify(user.password, password))) {
      const status = 400
      const message = "Acesso Negado! Credenciais inválidas"
      return response.badRequest({status, message})
    }

    // Verify password
    if (user.emailVerifiedAt === null) {
      user.sendVerificationEmail()
      const status = 400
      const message =
        "O e-mail com as credenciais não foi verificado! abra sua caixa de correio e proceda com a verificação."
      return response.badRequest({status, message})
    }

    await user.clearOldTokens()

    // Generate token
    const {type, token} = await auth.use("api").generate(user, {expiresIn: "30mins"})

    response.created({token: `${type} ${token}`})
  }
}
