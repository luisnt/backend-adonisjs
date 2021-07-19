import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    const schemas = schema.create({
      name: schema.string({}, [rules.required()]),
      email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
      password: schema.string({}, [rules.confirmed()]),
    })
    const data = await request.validate({ schema: schemas })
    const user = await User.create(data)

    user?.sendVerificationEmail()

    return response.created(user)
  }
  public async sendMailConfirmation({ request, response }: HttpContextContract) {
    const schemas = schema.create({
      email: schema.string({}, [rules.email()]),
    })

    const data = await request.validate({ schema: schemas })

    // Lookup user manually
    const user = await User.query()
      .where('email', data.email)
      .andWhere('active', true)
      .firstOrFail()

    user?.sendVerificationEmail()

    return response.accepted(user)
  }

  public async verifyAccount({ response, params }: HttpContextContract) {
    const { id } = params
    const mailToken = params?.token

    const user = await User.findOrFail(id)
    const saved = await user?.saveEmailVerifyAt(mailToken)
    const { name, email, emailVerifiedAt } = user

    return response.json({ id, name, email, emailVerifiedAt, saved })
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const schemas = schema.create({
      email: schema.string({}, [rules.required(), rules.email()]),
      password: schema.string({}, [rules.required()]),
    })
    const { email, password } = await request.validate({ schema: schemas })

    // Lookup user manually
    const user = await User.query().where('email', email).andWhere('active', true).firstOrFail()

    // Verify password
    if (!(await Hash.verify(user.password, password))) {
      return response.badRequest('Invalid credentials')
    }

    // Verify password
    if (user.emailVerifiedAt === null) {
      user.sendVerificationEmail()
      return response.badRequest({ error: 'Credentials email not verified! open your mail box' })
    }

    await user.clearOldTokens()

    // Generate token
    const { type, token } = await auth.use('api').generate(user, { expiresIn: '30mins' })

    response.created({ token: `${type} ${token}` })
  }
}
