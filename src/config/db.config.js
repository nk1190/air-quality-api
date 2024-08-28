// load env configuration
require('dotenv').config();
// import mysql 
const mysql = require('mysql2');

// import the logger 
const logger = require('../config/logger.config');

// init mysql connection 
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// connect to mysql db server 
connection.connect(err => {
  if (err) throw err;
  logger.info('Connected to the MySQL database.');
});



module.exports = connection;

