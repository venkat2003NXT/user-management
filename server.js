const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Database path
const dbPath = path.resolve(__dirname, "db", "user_management.db");

// Connect to SQLite DB
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log(`✅ Connected to SQLite database at ${dbPath}`);
  }
});

// ------------------ ROUTES ------------------

// Get all users
app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});


// Get user by id
app.get('/users/:user_id', (req, res) => {
  const { user_id } = req.params;
  db.get('SELECT * FROM users WHERE user_id = ?', [user_id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(row);
  });
});

// Add new user
app.post('/users', (req, res) => {
  const { full_name, mob_num, pan_num, manager_id } = req.body;
  db.run(
    `INSERT INTO users (full_name, mob_num, pan_num, manager_id) VALUES (?, ?, ?, ?)`,
    [full_name, mob_num, pan_num, manager_id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: '✅ User created successfully', user_id: this.lastID });
    }
  );
});


// Update user
app.put('/users/:user_id', (req, res) => {
  const { user_id } = req.params;
  const { full_name, mob_num, pan_num, manager_id, is_active } = req.body;

  db.run(
    `UPDATE users
     SET full_name = ?, mob_num = ?, pan_num = ?, manager_id = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = ?`,
    [full_name, mob_num, pan_num, manager_id, is_active, user_id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: '✅ User updated successfully', changes: this.changes });
    }
  );
});


// Delete user
app.delete('/users/:user_id', (req, res) => {
  const { user_id } = req.params;

  db.run(`DELETE FROM users WHERE user_id = ?`, [user_id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: '✅ User deleted successfully', changes: this.changes });
  });
});


// ------------------ START SERVER ------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
