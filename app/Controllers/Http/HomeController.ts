import Mail from "@ioc:Adonis/Addons/Mail"
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext"
import {DateTime} from "luxon"
import PasswordResetRules from "./Rules/PasswordResetRules"

import {name as AppName, version} from "../../../package.json"

export default class HomeController {
  public async index({request, response}: HttpContextContract) {
    const {accept} = request.headers()
    const message = "Bem vindo a área pública"
    const server = `${AppName} .:. ${version} .:. Adonis JS Api`
    const now = DateTime.local().toFormat("dd/MM/yyyy HH:mm:ss")

    return response.ok({
      server,
      accept,
      message,
      now,
    })
  }

  public async mail({request, response}: HttpContextContract) {
    const {id} = request.params()
    if (process.env.NODE_ENV !== "production" || id === "777") {
      const {email} = await request.validate(PasswordResetRules)
      const message = "Rota de teste de envio de email."
      const server = `Adonis JS Api - Send Mail to ${email}`
      const now = DateTime.local().toFormat("dd/MM/yyyy HH:mm:ss")

      const user = {name: "Luis Nt - Testando...", email}

      const url = `https://www.cartaovt.com.br`
      Mail.sendLater((message) => {
        message
          .from("verify@no-response-this-mail.com")
          .to(email)
          .subject(`Teste verify de Envio de Email: ${now}`)
          .htmlView("emails/verify", {user, url})
      })

      Mail.sendLater((message) => {
        message
          .from("verify@no-response-this-mail.com")
          .to(email)
          .subject(`Teste reset Email: ${now}`)
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
