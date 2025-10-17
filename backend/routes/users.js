// routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcrypt');

// ✅ Get all users (exclude admins)
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM users WHERE role != "admin"');
    res.json(results || []);
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ Search users (exclude admins)
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  try {
    const [results] = await db.query(
      `SELECT * FROM users WHERE (name LIKE ? OR user_id LIKE ?) AND role != "admin"`,
      [`%${q}%`, `%${q}%`]
    );
    res.json(results || []);
  } catch (err) {
    console.error('❌ Error searching users:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ Get single user by user_id
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const [results] = await db.query(
      'SELECT * FROM users WHERE user_id = ? AND role != "admin"',
      [user_id]
    );
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(results[0]);
  } catch (err) {
    console.error('❌ Error fetching user:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ Add new user
router.post('/add', async (req, res) => {
  try {
    const { name, user_id, department, role, password } = req.body;

    if (!name || !user_id || !role)
      return res.status(400).json({ error: 'Missing required fields' });

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const [result] = await db.query(
      `INSERT INTO users (name, user_id, department, role, password_hash)
       VALUES (?, ?, ?, ?, ?)`,
      [name, user_id, department || '', role, hashedPassword || '']
    );

    res.json({ message: '✅ User added successfully', userId: result.insertId });
  } catch (err) {
    console.error('❌ Error adding user:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ Update user
router.put('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { name, department, role, password } = req.body;

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const query = `
      UPDATE users
      SET name = ?, department = ?, role = ?
      ${hashedPassword ? ', password_hash = ?' : ''}
      WHERE user_id = ? AND role != "admin"
    `;
    const params = hashedPassword
      ? [name, department, role, hashedPassword, user_id]
      : [name, department, role, user_id];

    await db.query(query, params);
    res.json({ message: '✅ User updated successfully' });
  } catch (err) {
    console.error('❌ Error updating user:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ Delete user
router.delete('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    await db.query(`DELETE FROM users WHERE user_id = ? AND role != "admin"`, [user_id]);
    res.json({ message: '✅ User deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting user:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
