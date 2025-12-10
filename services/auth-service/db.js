const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const dbPath = path.join(dbDir, 'users.db');
const db = new Database(dbPath);

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const checkUser = db.prepare('SELECT * FROM users WHERE username = ?').get('demo');
  if (!checkUser) {
    const insertUser = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    insertUser.run('demo', 'password123');
    console.log('✅ Demo user created in Auth Service');
  }
}

initializeDatabase();
module.exports = db;
