const mysql = require("mysql");
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Create a connection pool for better performance
const db = mysql.createPool({
  connectionLimit: 10, // Adjust based on your needs
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

// Test the connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
  console.log("Connected to the database.");
  connection.release(); // Release the connection back to the pool
});

module.exports = db;
