import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext"
import {base64} from "@ioc:Adonis/Core/Helpers"
import {DateTime} from "luxon"
import Database from "@ioc:Adonis/Lucid/Database"
import RequestCardRules from "App/Controllers/Http/Rules/RequestedCardRules"

export default class HomeController {
  public async index({request, response}: HttpContextContract) {
    const {accept} = request.headers()
    const params = request.all()
    const message = "bem vindo a área pública"
    const server = "Adonis JS Api"
    const now = DateTime.local().toSQL({includeOffset: false})

    return response.ok({
      server,
      now,
      message,
      accept,
      params,
    })
  }

  public async home({request, response}: HttpContextContract) {
    const {accept, authorization} = request.headers()
    const params = request.all()
    const message = "bem vindo a área privada"
    const server = "Adonis JS Api"
    const now = DateTime.local().toSQL({includeOffset: false})

    return response.ok({
      server,
      now,
      message,
      accept,
      authorization,
      params,
    })
  }

}