const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./vulnlab_plus.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,         
    email TEXT,
    role TEXT,
    ssn TEXT               
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner TEXT,
    title TEXT,
    body TEXT              
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner TEXT,
    service TEXT,
    api_key TEXT           
  )`);

  // Seed data
  db.run(`INSERT OR IGNORE INTO users (username, password, email, role, ssn)
          VALUES ('admin', 'admin123', 'admin@example.com', 'admin', '123-45-6789')`);
  db.run(`INSERT OR IGNORE INTO users (username, password, email, role, ssn)
          VALUES ('user', 'password', 'user@example.com', 'user', '111-22-3333')`);

  db.run(`INSERT OR IGNORE INTO notes (id, owner, title, body)
          VALUES (1, 'admin', 'Welcome', 'Hello from <b>VulnLab+</b>!')`);
});

module.exports = db;
