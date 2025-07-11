const { Pool } = require('pg');

const dotenv = require('dotenv');
dotenv.config({ path: './src/.env' });

console.log("PG Connection Config:", {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

const pool = new Pool({
  user: String(process.env.DB_USER),
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD),
  port: 5434,
});

module.exports = pool;