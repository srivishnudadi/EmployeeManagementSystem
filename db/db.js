// db/db.js
const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  timezone: 'Z',
  connectionLimit: 10, // Adjust based on your needs
  queueLimit: 0
 
});

// Export the pool for use in other modules
module.exports = pool;
