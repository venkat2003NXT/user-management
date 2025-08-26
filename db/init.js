const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.resolve(__dirname, 'user_management.db');

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database at', dbPath);
  }
});

db.serialize(() => {
  // Drop old tables (to avoid conflicts during dev)
  db.run(`DROP TABLE IF EXISTS users`);
  db.run(`DROP TABLE IF EXISTS managers`);

  // Create managers table
  db.run(`
    CREATE TABLE managers (
      manager_id INTEGER PRIMARY KEY AUTOINCREMENT,
      is_active INTEGER DEFAULT 1
    )
  `);

  // Create users table
  db.run(`
    CREATE TABLE users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      mob_num TEXT UNIQUE NOT NULL,
      pan_num TEXT UNIQUE NOT NULL,
      manager_id INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      is_active INTEGER DEFAULT 1,
      FOREIGN KEY (manager_id) REFERENCES managers (manager_id)
    )
  `);

  console.log("✅ Tables created successfully");
});

module.exports = db;
