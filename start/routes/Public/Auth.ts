import Route from "@ioc:Adonis/Core/Route"

Route.post("/register", "AuthController.register")
Route.post("/password-reset", "AuthController.passwordReset")
Route.post("/password-change", "AuthController.passwordChange")
Route.post("/verify", "AuthController.verifyAccount")
Route.post("/login", "AuthController.login")
Route.post("/logout", "AuthController.logout")