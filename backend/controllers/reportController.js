// controllers/reportController.js
const db = require('../db/db');

// ----- Create a new report -----
exports.createReport = (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const query = `INSERT INTO reports (title, description, user_id, status) VALUES (?, ?, ?, 'in_process')`;

  db.query(query, [title, description, userId], (err, result) => {
    if (err) {
      console.error('❌ Error inserting report:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.status(201).json({
      message: '✅ Report submitted successfully',
      report: { id: result.insertId, title, description, user_id: userId, status: 'in_process', created_at: new Date() }
    });
  });
};

// ----- Get all reports (Admin) -----
exports.getAllReports = (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admins only' });

  const query = `
    SELECT r.id, r.title, r.description, r.status, r.comments, r.created_at, r.updated_at, u.name AS user_name
    FROM reports r
    JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(200).json(results);
  });
};

// ----- Get user reports -----
exports.getMyReports = (req, res) => {
  const userId = req.user.id;

  const query = `SELECT id, title, description, status, comments, created_at, updated_at FROM reports WHERE user_id = ? ORDER BY created_at DESC`;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch reports' });
    res.status(200).json(results);
  });
};

// ----- Update report (Admin) -----
exports.updateReport = (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admins only' });

  const { id } = req.params;
  const { status, comments } = req.body;

  if (!status && !comments) return res.status(400).json({ error: 'Provide status or comments' });

  const query = `UPDATE reports SET status = COALESCE(?, status), comments = COALESCE(?, comments), updated_at = NOW() WHERE id = ?`;

  db.query(query, [status, comments, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to update report' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Report not found' });
    res.json({ message: '✅ Report updated successfully' });
  });
};
