const mysql = require('mysql2/promise');
require('dotenv').config();
const bcrypt = require('bcrypt');

// Create MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize tables
const initializeTables = async () => {
  try {
    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        user_id VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        department VARCHAR(50),
        role ENUM('admin','user','student','staff','guard','visitor') NOT NULL,
        face_embedding JSON DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Default Admin
    const [adminCheck] = await db.query(`SELECT * FROM users WHERE user_id = ?`, ['001']);
    if (adminCheck.length === 0) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      await db.query(
        `INSERT INTO users (name, user_id, role, password_hash) VALUES (?, ?, ?, ?)`,
        ['Admin User', '001', 'admin', hashedPassword]
      );
      console.log('✅ Default admin created: user_id=001, password=admin');
    }

    // Visitors table
    await db.query(`
      CREATE TABLE IF NOT EXISTS visitors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone_number VARCHAR(15) NOT NULL,
        id_type VARCHAR(50) NOT NULL,
        id_number VARCHAR(50) NOT NULL,
        qr_code TEXT,
        checked_in TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_action ENUM('ENTRY','EXIT') DEFAULT NULL,
        last_action_time TIMESTAMP NULL
      )
    `);

    // Incidents table
    await db.query(`
      CREATE TABLE IF NOT EXISTS incidents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status ENUM('pending','resolved') DEFAULT 'pending',
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ All tables (users, visitors, incidents) initialized.');
  } catch (err) {
    console.error('❌ Error initializing tables:', err);
  }
};

initializeTables();

module.exports = db;
