const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'warrantyone1_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true, // return DATE/DATETIME as plain strings, not JS Date objects
});

pool.getConnection()
  .then((conn) => {
    console.log('Connected to MySQL database');
    conn.release();
  })
  .catch((err) => {
    console.error('MySQL connection error:', err.message);
  });

module.exports = pool;
