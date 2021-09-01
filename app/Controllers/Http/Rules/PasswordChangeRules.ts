import {schema, rules} from "@ioc:Adonis/Core/Validator"

const validations = schema.create({
  id: schema.string({trim: true}, [rules.required()]),
  token: schema.string({trim: true}, [rules.required()]),
  key: schema.string({trim: true}, [rules.required()]),
  password: schema.string({trim: true}, [rules.required(), rules.confirmed("password_confirmation")]),
})

const messages = {
  "id.required": "Autenticação provisória inválida.",
  "token.required": "Autenticação provisória inválida.",
  "key.required": "Autenticação provisória inválida.",
  "password.required": "Informe um valor para o campo SENHA.",
  "password.confirmed": "A confirmação deve ser igual a senha.",
  "password_confirmation.confirmed": "A confirmação deve ser igual a senha.",
}

const PasswordChangeRules = {schema: validations, messages}
export default PasswordChangeRules
