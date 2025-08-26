const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db/user_management.db");

// Predefined managers
const managers = [
  { is_active: 1 },
  { is_active: 1 },
];

// Predefined users
const users = [
  {
    full_name: "John Doe",
    mob_num: "9876543210",
    pan_num: "ABCDE1234F",
    manager_id: 1,
  },
  {
    full_name: "Jane Smith",
    mob_num: "9123456789",
    pan_num: "FGHIJ6789K",
    manager_id: 2,
  },
  {
    full_name: "Alice Johnson",
    mob_num: "9988776655",
    pan_num: "LMNOP2345Q",
    manager_id: 1,
  },
  {
    full_name: "Bob Williams",
    mob_num: "9090909090",
    pan_num: "QRSTU9876V",
    manager_id: 2,
  },
  {
    full_name: "Charlie Brown",
    mob_num: "8888888888",
    pan_num: "WXYZA5432B",
    manager_id: 1,
  },
];

db.serialize(() => {
  console.log("🌱 Seeding database...");

  // Clear old data
  db.run("DELETE FROM users");
  db.run("DELETE FROM managers");

  // Reset auto-increment counters
  db.run("DELETE FROM sqlite_sequence WHERE name='users'");
  db.run("DELETE FROM sqlite_sequence WHERE name='managers'");

  // Insert managers
  managers.forEach((m) => {
    db.run(`INSERT INTO managers (is_active) VALUES (?)`, [m.is_active]);
  });

  // Insert users
  users.forEach((u) => {
    db.run(
      `INSERT INTO users (full_name, mob_num, pan_num, manager_id, created_at, updated_at, is_active)
       VALUES (?, ?, ?, ?, datetime('now'), datetime('now'), 1)`,
      [u.full_name, u.mob_num, u.pan_num, u.manager_id]
    );
  });
});

db.close(() => {
  console.log("✅ Database seeding complete!");
});

