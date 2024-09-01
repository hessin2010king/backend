require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize tables if not exists
const initializeTables = () => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      role ENUM('admin', 'user')
    );
  `;

  const createCategoriesTable = `
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255)
    );
  `;

  const createAuthorsTable = `
    CREATE TABLE IF NOT EXISTS authors (
      id INT AUTO_INCREMENT PRIMARY KEY,
      photo VARCHAR(255),
      firstName VARCHAR(255),
      lastName VARCHAR(255),
      dateOfBirth DATE
    );
  `;

  const createBooksTable = `
    CREATE TABLE IF NOT EXISTS books (
      id INT AUTO_INCREMENT PRIMARY KEY,
      photo VARCHAR(255),
      name VARCHAR(255),
      description TEXT,  
      categoryId INT,
      authorId INT,
      FOREIGN KEY (categoryId) REFERENCES categories(id),
      FOREIGN KEY (authorId) REFERENCES authors(id)
    );
  `;

  const createReviewsTable = `
    CREATE TABLE IF NOT EXISTS reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      bookId INT,
      reviewText TEXT,
      rating INT,
      stars INT,
      FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE CASCADE
    );
  `;

  // Execute table creation queries
  db.query(createUsersTable, (err) => {
    if (err) throw err;
    console.log("Users table initialized.");
  });

  db.query(createCategoriesTable, (err) => {
    if (err) throw err;
    console.log("Categories table initialized.");
  });

  db.query(createAuthorsTable, (err) => {
    if (err) throw err;
    console.log("Authors table initialized.");
  });

  db.query(createBooksTable, (err) => {
    if (err) throw err;
    console.log("Books table initialized.");
  });

  db.query(createReviewsTable, (err) => {
    if (err) throw err;
    console.log("Reviews table initialized.");
  });
};

initializeTables(); // Initialize tables

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Alex Library API");
});

// Authentication route (without token requirement)
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username = ? AND password = ?";

  db.query(query, [username, password], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.length > 0) {
      const user = results[0];
      if (user.role === "admin") {
        res.status(200).json({ success: true, role: user.role });
      } else {
        res
          .status(403)
          .json({ success: false, message: "Access denied. Not an admin." });
      }
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });
});

// User login route
app.post("/user/login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username = ? AND password = ?";

  db.query(query, [username, password], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.length > 0) {
      const user = results[0];
      if (user.role === "user") {
        res.status(200).json({ success: true, role: user.role });
      } else {
        res
          .status(403)
          .json({ success: false, message: "Access denied. Not a user." });
      }
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });
});

// Admin routes (no authentication required)
const adminRoutes = require('./routes/admintRoutes'); // Updated route path
app.use("/admin", adminRoutes);

// User routes
const userRoutes = require('./routes/userRoutes');
app.use("/user", userRoutes);

// Updated server listener for Vercel compatibility
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = app; // Exporting the app for Vercel compatibility
