import {schema, rules} from "@ioc:Adonis/Core/Validator"

const validations = schema.create({
  user_id: schema.number([
    rules.required(),
    rules.unique({table: "requested_cards", column: "user_id"}),
  ]),

  birth: schema.date({}, [rules.required()]),
  sex: schema.string({trim:true}, [rules.required()]),

  address_cep: schema.string({trim:true}, [rules.required()]),
  address_road: schema.string({trim:true}, [rules.required()]),
  address_number: schema.string({trim:true}, [rules.required()]),
  address_complement: schema.string({trim:true}, [rules.required()]),
  address_district: schema.string({trim:true}, [rules.required()]),
  address_city: schema.string({trim:true}, [rules.required()]),
  address_state: schema.string({trim:true}, [rules.required()]),

  phone: schema.string({trim:true}),
})

const messages = {
  "user_id.required": "A conexão expirou. Faça login novamente para continuar",
  "user_id.unique": "Cartão já solicitado",

  "birth.required": "Informe um valor para o campo NASCIDO.",
  "birth.date.format": "Informe uma data válida campo NASCIDO.",
  "sex.required": "Informe um valor para o campo SEXO.",

  "address_cep.required": "Informe um valor para o campo CEP.",
  "address_road.required": "Informe um valor para o campo LOGRADOURO.",
  "address_number.required": "Informe um valor para o campo NÚMERO.",
  "address_complement.required": "Informe um valor para o campo COMPLEMENTO.",
  "address_district.required": "Informe um valor para o campo BAIRRO.",
  "address_city.required": "Informe um valor para o campo CIDADE.",
  "address_state.required": "Informe um valor para o campo UF."
}

const RequestCardRules = {schema: validations, messages}
export default RequestCardRules
