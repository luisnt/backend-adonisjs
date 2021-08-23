import Route from "@ioc:Adonis/Core/Route"

Route.get("/", "HomeController.index")

Route.post("/mail/:id", "HomeController.mail")
