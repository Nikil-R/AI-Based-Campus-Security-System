// routes/incidents.js
const express = require('express');
const router = express.Router();
const db = require('../db/db');
const authenticateToken = require('../middleware/authMiddleware');

// ----- Get all incidents (Admin) -----
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM incidents ORDER BY timestamp DESC');
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching incidents:', err);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

// ----- Get incidents of logged-in user -----
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM incidents WHERE user_id = ? ORDER BY timestamp DESC', [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching user incidents:', err);
    res.status(500).json({ error: 'Failed to fetch user incidents' });
  }
});

// ----- Create new incident -----
router.post('/', authenticateToken, async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) return res.status(400).json({ error: 'Title and description are required' });

  try {
    const [result] = await db.query(
      'INSERT INTO incidents (user_id, title, description) VALUES (?, ?, ?)',
      [req.user.id, title, description]
    );
    res.json({ message: 'Incident reported successfully', id: result.insertId });
  } catch (err) {
    console.error('❌ Error creating incident:', err);
    res.status(500).json({ error: 'Failed to create incident' });
  }
});

// ----- Update incident status (Mark resolved) -----
router.put('/:id', authenticateToken, async (req, res) => {
  const { status } = req.body;
  const incidentId = req.params.id;

  if (!status) return res.status(400).json({ error: 'Status is required' });

  try {
    await db.query('UPDATE incidents SET status = ? WHERE id = ?', [status, incidentId]);
    res.json({ message: 'Incident status updated successfully' });
  } catch (err) {
    console.error('❌ Error updating incident:', err);
    res.status(500).json({ error: 'Failed to update incident' });
  }
});

module.exports = router;
