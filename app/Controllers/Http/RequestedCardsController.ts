import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext"
import {DateTime} from "luxon"
import RequestedCardRules from "App/Controllers/Http/Rules/RequestedCardRules"
import RequestedCard from "App/Models/RequestedCard"

export default class RequestedCardsController {
  public async index({response, auth}: HttpContextContract) {
    const userId = auth.user?.id || 0
    const card = await RequestedCard.findByOrFail("user_id", userId)
    const date = card.createdAt.toLocaleString(DateTime.DATETIME_SHORT)
    const status = "Cartão solicitado com sucesso"
    return response.ok([{date, status}])
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
