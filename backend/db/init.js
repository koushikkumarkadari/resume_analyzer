const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./resumes.db');

const initDatabase = () => {
  db.serialize(() => {
    // Users table for authentication
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin INTEGER DEFAULT 0
      )
    `);

    // Updated resumes table with user_id
    db.run(`
      CREATE TABLE IF NOT EXISTS resumes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        file_name TEXT NOT NULL,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        name TEXT,
        email TEXT,
        phone TEXT,
        linkedin_url TEXT,
        portfolio_url TEXT,
        summary TEXT,
        work_experience TEXT,
        education TEXT,
        technical_skills TEXT,
        soft_skills TEXT,
        projects TEXT,
        certifications TEXT,
        resume_rating INTEGER,
        improvement_areas TEXT,
        upskill_suggestions TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
  });
};

module.exports = { db, initDatabase };