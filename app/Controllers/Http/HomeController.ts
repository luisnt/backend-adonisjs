import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext"
import {DateTime} from "luxon"

export default class HomeController {
  public async index({request, response}: HttpContextContract) {
    const {accept} = request.headers()
    const params = request.all()
    const body = request.body()
    const message = "bem vindo a área pública"
    const server = "Adonis JS Api"
    const now = DateTime.local().toSQL({includeOffset: false})

    return response.ok({
      server,
      now,
      message,
      accept,
      body,
      params,
    })
  }
}
