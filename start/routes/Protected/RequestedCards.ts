import Route from "@ioc:Adonis/Core/Route"

Route.group(() => {
  Route.get("/home", "RequestedCardsController.home")
  Route.post("/request-card", "RequestedCardsController.store")
  Route.get("/info-same-card", "RequestedCardsController.index")
  Route.get("/info-same-card/:cpf", "RequestedCardsController.show")
}).middleware("auth")
