const express = require("express");
const db = require("../db"); // Adjust path as needed
const bcrypt = require("bcrypt"); // For password hashing
const router = express.Router();

// User signup route
router.post("/signup", async (req, res) => {
  const { username, password, firstName, lastName, email, role = "user" } = req.body; // Default role to 'user'

  // Check if the username already exists
  const checkUserQuery = "SELECT * FROM users WHERE username = ?";
  db.query(checkUserQuery, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error checking user" });
    }
    if (results.length > 0) {
      return res.status(409).json({ error: "Username already exists" });
    }

    try {
      // Hash the password before saving to the database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user into the database
      const insertUserQuery =
        "INSERT INTO users (username, password, firstName, lastName, email, role) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(
        insertUserQuery,
        [username, hashedPassword, firstName, lastName, email, role],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: "Error creating user" });
          }
          res.status(201).json({ success: true, message: "User created successfully" });
        }
      );
    } catch (hashError) {
      console.error("Error hashing password:", hashError);
      res.status(500).json({ error: "Error processing your request" });
    }
  });
});

module.exports = router;
