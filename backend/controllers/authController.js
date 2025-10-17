// controllers/authController.js
const db = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, user_id, password, department, role } = req.body;
    if (!name || !user_id || !password)
      return res.status(400).json({ message: 'Name, user_id, and password are required' });

    // Check if user already exists
    const [existing] = await db.query(`SELECT * FROM users WHERE user_id = ?`, [user_id]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'User ID already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      `INSERT INTO users (name, user_id, password_hash, department, role) VALUES (?, ?, ?, ?, ?)`,
      [name, user_id, hashedPassword, department || null, role || 'student']
    );

    res.status(201).json({ message: '✅ User registered successfully' });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { user_id, password } = req.body;
    if (!user_id || !password)
      return res.status(400).json({ message: 'user_id and password are required' });

    const [results] = await db.query(`SELECT * FROM users WHERE user_id = ?`, [user_id]);

    if (results.length === 0)
      return res.status(401).json({ message: 'User not found' });

    const user = results[0];

    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, user_id: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      message: '✅ Login successful',
      token,
      user: { id: user.id, name: user.name, user_id: user.user_id, role: user.role }
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
};
