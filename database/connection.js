const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync('./certificate/ca.pem'),
    rejectUnauthorized: true
  }
});

module.exports = connection;
