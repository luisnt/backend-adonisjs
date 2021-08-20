/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from "@ioc:Adonis/Core/Env"
import {DatabaseConfig} from "@ioc:Adonis/Lucid/Database"

const NODE_ENV_PRODUCTION = "production"

let connection: any = {
  host: Env.get("PG_HOST"),
  port: Env.get("PG_PORT"),
  user: Env.get("PG_USER"),
  password: Env.get("PG_PASSWORD"),
  database: Env.get("PG_DB_NAME"),
}

if (process.env.NODE_ENV === NODE_ENV_PRODUCTION) {
  const rejectUnauthorized = false
  const ssl = {rejectUnauthorized}
  connection = {...connection, ssl}
}

const databaseConfig: DatabaseConfig = {
  connection: Env.get("DB_CONNECTION", "pg"),

  connections: {
    // PostgreSQL dependencies | npm i pg
    pg: {
      client: "pg",
      connection,
      migrations: {
        naturalSort: true,
      },
      healthCheck: false,
      debug: false,
    },
  },
}

export default databaseConfig
