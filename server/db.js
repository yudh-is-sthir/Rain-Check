const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.join(__dirname, '..', 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const dbPath = path.join(dbDir, 'raincheck.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database tables
function initializeDatabase() {
  // Create sessions table for express-session
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      sid TEXT PRIMARY KEY,
      sess TEXT NOT NULL,
      expired INTEGER NOT NULL
    )
  `);

  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert demo user (hardcoded for MVP)
  const checkUser = db.prepare('SELECT * FROM users WHERE username = ?').get('demo');
  
  if (!checkUser) {
    const insertUser = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    // In production, this should be hashed! For MVP, we're keeping it simple
    insertUser.run('demo', 'password123');
    console.log('✅ Demo user created: username="demo", password="password123"');
  }

  console.log('✅ Database initialized successfully');
}

// Initialize on module load
initializeDatabase();

module.exports = db;
