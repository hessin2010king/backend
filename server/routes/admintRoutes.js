const express = require("express");
const router = express.Router();
const db = require("../db");

// Authors Routes
router.get("/authors", (req, res) => {
  const query = "SELECT * FROM authors";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post("/authors", (req, res) => {
  const { photo, firstName, lastName, dateOfBirth } = req.body;
  const query =
    "INSERT INTO authors (photo, firstName, lastName, dateOfBirth) VALUES (?, ?, ?, ?)";
  db.query(query, [photo, firstName, lastName, dateOfBirth], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res
      .status(201)
      .json({ id: results.insertId, photo, firstName, lastName, dateOfBirth });
  });
});

router.put("/authors/:id", (req, res) => {
  const { id } = req.params;
  const { photo, firstName, lastName, dateOfBirth } = req.body;
  const query =
    "UPDATE authors SET photo = ?, firstName = ?, lastName = ?, dateOfBirth = ? WHERE id = ?";
  db.query(
    query,
    [photo, firstName, lastName, dateOfBirth, id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, photo, firstName, lastName, dateOfBirth });
    }
  );
});

router.delete("/authors/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM authors WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).end();
  });
});

// Get popular authors
router.get("/authors/popular", (req, res) => {
  const query = `SELECT a.id, a.firstName, a.lastName, COUNT(b.id) AS bookCount
  FROM authors a 
  LEFT JOIN books b ON a.id = b.authorId 
  GROUP BY a.id, a.firstName, a.lastName 
  ORDER BY bookCount 
  DESC LIMIT 10;`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get books by author
router.get("/authors/:id/books", (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
  books.id AS bookId, 
  books.name AS bookName, 
  books.photo AS bookPhoto , 
  authors.id AS authorId, 
  CONCAT(authors.firstName, ' ', authors.lastName) AS authorName,
  categories.name AS categoryName
FROM 
  books
JOIN 
  authors ON books.authorId = authors.id
JOIN 
  categories ON books.categoryId = categories.id
WHERE 
  books.authorId = ?;

  `;
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Categories Routes
router.get("/categories", (req, res) => {
  const query = "SELECT * FROM categories";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post("/categories", (req, res) => {
  const { name } = req.body;
  const query = "INSERT INTO categories (name) VALUES (?)";
  db.query(query, [name], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: results.insertId, name });
  });
});

router.put("/categories/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const query = "UPDATE categories SET name = ? WHERE id = ?";
  db.query(query, [name, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, name });
  });
});

router.delete("/categories/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM categories WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).end();
  });
});

// Get popular categories
router.get("/categories/popular", (req, res) => {
  const query = "SELECT c.id, c.name, COUNT(b.id) AS bookCount FROM categories c LEFT JOIN books b ON c.id = b.categoryId GROUP BY c.id, c.name ORDER BY bookCount DESC LIMIT 10; ";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
//Get books by category 
router.get("/categories/:id/books", (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      books.id AS bookId, 
      books.name AS bookName, 
      books.photo AS bookPhoto, 
      authors.id AS authorId, 
      CONCAT(authors.firstName, ' ', authors.lastName) AS authorName
    FROM 
      books 
    JOIN 
      authors 
    ON 
      books.authorId = authors.id 
    WHERE 
      books.categoryId = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Books Routes
router.get("/books", (req, res) => {
  const query = "SELECT id , photo as bookPhoto , name as bookName , categoryId , authorId , description as bookDescription FROM books;";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post("/books", (req, res) => {
  const { photo, name, categoryId, authorId, description } = req.body;
  const query =
    "INSERT INTO books (photo, name, categoryId, authorId, description) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [photo, name, categoryId, authorId, description], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: results.insertId, photo, name, categoryId, authorId, description });
  });
});

router.put("/books/:id", (req, res) => {
  const { id } = req.params;
  const { photo, name, categoryId, authorId, description } = req.body;
  const query =
    "UPDATE books SET photo = ?, name = ?, categoryId = ?, authorId = ?, description = ? WHERE id = ?";
  db.query(query, [photo, name, categoryId, authorId, description, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, photo, name, categoryId, authorId, description });
  });
});

router.delete("/books/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM books WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).end();
  });
});

// Get popular books
router.get("/books/popular", (req, res) => {
  const query = "SELECT b.name, COUNT(r.id) AS popularity FROM books b LEFT JOIN reviews r ON b.id = r.bookId GROUP BY b.name ORDER BY popularity DESC LIMIT 10;";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get book details by ID
router.get("/books/:id", (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      books.id AS bookId, 
      books.name AS bookName, 
      books.photo AS bookPhoto, 
      books.description AS bookDescription,
      categories.name AS categoryName,
      CONCAT(authors.firstName, ' ', authors.lastName) AS authorName,
      AVG(reviews.rating) AS averageRating,
      COUNT(reviews.id) AS reviewCount
    FROM 
      books
    LEFT JOIN 
      categories ON books.categoryId = categories.id
    LEFT JOIN 
      authors ON books.authorId = authors.id
    LEFT JOIN 
      reviews ON books.id = reviews.bookId
    WHERE 
      books.id = ?
    GROUP BY 
      books.id, books.name, books.photo, books.description, categories.name, authors.firstName, authors.lastName
  `;
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

// Get reviews for a book
router.get("/books/:id/reviews", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM reviews WHERE bookId = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//routes for reviewes 

router.get("/reviews", (req, res) => {
  const query = "SELECT * FROM reviews";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post("/reviews", (req, res) => {
  const { bookId, reviewText, rating, stars } = req.body;
  const query =
    "INSERT INTO reviews (bookId, reviewText, rating, stars) VALUES (?, ?, ?, ?)";
  db.query(query, [bookId, reviewText, rating, stars], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res
      .status(201)
      .json({ id: results.insertId, bookId, reviewText, rating, stars });
  });
});

router.put("/reviews/:id", (req, res) => {
  const { id } = req.params;
  const { reviewText, rating, stars } = req.body;
  const query =
    "UPDATE reviews SET reviewText = ?, rating = ?, stars = ? WHERE id = ?";
  db.query(query, [reviewText, rating, stars, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, reviewText, rating, stars });
  });
});

router.delete("/reviews/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM reviews WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).end();
  });
});

module.exports = router;
