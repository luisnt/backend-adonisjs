import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext"
import {DateTime} from "luxon"
import RequestedCardRules from "App/Controllers/Http/Rules/RequestedCardRules"
import RequestedCard from "App/Models/RequestedCard"
import User from "App/Models/User"

export default class RequestedCardsController {
  public async home({request, response}: HttpContextContract) {
    const {accept, authorization} = request.headers()
    const params = request.all()
    const message = "bem vindo a área privada"
    const server = "Adonis JS Api"
    const now = DateTime.local().toFormat("dd/MM/yyyy HH:mm:ss")

    return response.ok({
      server,
      now,
      message,
      accept,
      authorization,
      params,
    })
  }

  public async index({response, auth}: HttpContextContract) {
    const userId = auth.user?.id || 0
    const card = await RequestedCard.findByOrFail("user_id", userId)
    const date = card.createdAt.toFormat("dd/MM/yyyy HH:mm")
    const status = "Cartão solicitado com sucesso"
    return response.ok([{date, status}])
  }

  public async show({request, response}: HttpContextContract) {
    const {cpf} = request.params()
    const [user] = await User.query().select(["id", "name", "email"]).where("cpf", cpf)
    const card = await RequestedCard.findBy("user_id", user.id)
    const now = DateTime.local().toFormat("dd/MM/yyyy HH:mm")
    const date = card?.createdAt.toFormat("dd/MM/yyyy HH:mm")
    const status = date !== undefined ? "Cartão solicitado com sucesso" : "Cartão não solicitado"
    const requestedCard = {date: date || now, status}
    const {id, name, email} = user
    return response.ok({id, name, email, ...requestedCard})
  }

  public async store({request, response, auth}: HttpContextContract) {
    let data = {}
    const body = request.body()
    const userId = auth.user?.id || 0
    const parsed = {...body, user_id: +userId}
    request.updateBody(parsed)

    try {
      data = await request.validate(RequestedCardRules)
    } catch (error) {
      const errors = error.messages.errors ?? []
      return response.notAcceptable(errors)
    }

    const requestedCard = await RequestedCard.create(data)

    return response.created(requestedCard)
  }
}
