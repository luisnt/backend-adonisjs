import {schema, rules} from "@ioc:Adonis/Core/Validator"

const validations = schema.create({
  email: schema.string({trim: true}, [rules.required(), rules.email()]),
  password: schema.string({trim: true}, [rules.required()]),
})

const messages = {
  "email.required": "Informe um valor para o campo E-MAIL.",
  "email.email": "Informe um email válido.",
  "password.required": "Informe um valor para o campo SENHA.",
}

const LoginRules = {schema: validations, messages}
export default LoginRules
