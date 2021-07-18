import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'

export default class AuthController {
    public async register({ request, response }: HttpContextContract) {
        const { email, password } = request.all()
        const user = await User.create({ email, password })
        response.created(user)
    }

    public async login({ request, response, auth }: HttpContextContract) {
        const { email, password } = request.all()

        // Lookup user manually
        const user = await User.query().where('email', email).firstOrFail()

        // Verify password
        if (!(await Hash.verify(user.password, password))) {
            return response.badRequest('Invalid credentials')
        }

        await user.clearOldTokens()

        // Generate token
        const { type, token } = await auth.use('api').generate(user)

        response.created({ token: `${type} ${token}` })
    }

}
