import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class HomeController {
  public async index({ request, response }: HttpContextContract) {
    const params = request.all()
    const message = 'bem vindo a área pública'
    const server = 'Adonis JS Api'
    const now = DateTime.local().toSQL({ includeOffset: false })

    return response.ok({
      server,
      now,
      message,
      params,
    })
  }

  public async home({ request, response }: HttpContextContract) {
    const params = request.all()
    const data = await User.all()
    const message = 'bem vindo a área privada'
    const server = 'Adonis JS Api'
    const now = DateTime.local().toSQL({ includeOffset: false })

    return response.ok({
      server,
      now,
      params,
      data,
      message,
    })
  }

  public async users({ request, response }: HttpContextContract) {
    const params = await request.all()
    const data = await User.all()

    response.ok({
      params,
      data,
    })
  }
}
