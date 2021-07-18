import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class HomeController {
    public async index({ request, response }: HttpContextContract) {
        const params = await request.all()
        const data = await User.all()
        const message = "bem vindo a área privada"

        response.ok({
            params,
            message,
            data
        })
    }
    
    public async users({ request, response }: HttpContextContract) {
        const params = await request.all()
        const data = await User.all()

        response.ok({
            params,
            data
        })
    }
}
