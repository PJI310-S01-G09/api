const dotenv = require("dotenv");
dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_NAME } = process.env;

const knexConfig = {
  client: "mysql2",
  connection: {
    host: DB_HOST,
    port: Number(DB_PORT) || 3306,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  },
  migrations: {
    tableName: "knex_migrations",
    directory : './src/db/migrations'
  },
}

module.exports = knexConfig;
