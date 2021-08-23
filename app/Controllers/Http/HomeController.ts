import Mail from "@ioc:Adonis/Addons/Mail"
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext"
import {DateTime} from "luxon"
import PasswordResetRules from "./Rules/PasswordResetRules"

interface SecId {
  id: string
}
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

  public async mail({request, response}: HttpContextContract) {
    const {id} = request.params()
    if (process.env.NODE_ENV !== "production" || id === "777") {
      const {email} = await request.validate(PasswordResetRules)
      const message = "Rota de teste de envio de email."
      const server = `Adonis JS Api - Send Mail to ${email}`
      const now = DateTime.local().toSQL({includeOffset: false})

      const user = {name: "Luis Nt - Testando...", email}

      const url = `https://www.cartaovt.com.br`
      await Mail.sendLater((message) => {
        message
          .from("verify@no-response-this-mail.com")
          .to(email)
          .subject(`Teste de Envio de Email: ${now}`)
          .htmlView("emails/reset", {user, url})
      })
      return response.ok({
        server,
        now,
        message,
      })
    }
  }
}
