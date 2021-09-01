import {schema, rules} from "@ioc:Adonis/Core/Validator"

const validations = schema.create({
  name: schema.string({escape: true, trim: true}, [rules.required()]),
  cpf: schema.string({trim: true}, [rules.required(), rules.unique({table: "users", column: "cpf"})]),
  email: schema.string({trim: true}, [
    rules.required(),
    rules.email(),
    rules.unique({table: "users", column: "email"}),
  ]),
  password: schema.string({trim: true}, [rules.required(), rules.confirmed("password_confirmation")]),
})

const messages = {
  "name.required": "Informe um valor para o campo NOME.",
  "cpf.required": "Informe um valor para o campo CPF.",
  "cpf.unique": "CPF já utilizado.",
  "email.required": "Informe um valor para o campo E-MAIL.",
  "email.email": "Informe um email válido.",
  "email.unique": "Email já utilizado.",
  "password.required": "Informe um valor para o campo SENHA.",
  "password.confirmed": "A confirmação deve ser igual a senha.",
  "password_confirmation.confirmed": "A confirmação deve ser igual a senha.",
}

const RegisterRules = {schema: validations, messages}
export default RegisterRules
