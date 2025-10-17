const db = require('../db/db'); // your MySQL connection

// GET /api/users/me
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const [rows] = await db.query('SELECT id, name, user_id, role, department, created_at, password_hash, face_embedding FROM users WHERE id = ?', [userId]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/logs/user-activity
const getUserActivity = async (req, res) => {
  try {
    const userId = req.user.id;

    const [[{ totalEntries, lastEntry }]] = await db.query(`
      SELECT COUNT(*) AS totalEntries, MAX(entry_time) AS lastEntry
      FROM entry_logs
      WHERE user_id = ?
    `, [userId]);

    const [[{ incidentsReported }]] = await db.query(`
      SELECT COUNT(*) AS incidentsReported
      FROM incidents
      WHERE user_id = ?
    `, [userId]);

    const [[{ incidentsPending }]] = await db.query(`
      SELECT COUNT(*) AS incidentsPending
      FROM incidents
      WHERE user_id = ? AND status = 'pending'
    `, [userId]);

    res.json({ totalEntries, lastEntry, incidentsReported, incidentsPending });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getUserProfile, getUserActivity };
