import {schema, rules} from "@ioc:Adonis/Core/Validator"

const validations = schema.create({
  email: schema.string({}, [
    rules.required(),
    rules.email(),
    rules.exists({table: "users", column: "email"}),
  ]),
})

const messages = {
  "email.required": "Informe um valor para o campo E-MAIL.",
  "email.email": "Informe um email válido.",
  "email.exists": "Informe um email cadastrado.",
}

const PasswordResetRules = {schema: validations, messages}
export default PasswordResetRules
