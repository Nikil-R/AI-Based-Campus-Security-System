// routes/reports.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { createReport, getAllReports, getMyReports, updateReport } = require('../controllers/reportController');

// Submit a new report
router.post('/', authenticateToken, createReport);

// Get logged-in user's reports
router.get('/my', authenticateToken, getMyReports);

// Get all reports (admin)
router.get('/all', authenticateToken, getAllReports);

// Update report (admin)
router.put('/:id', authenticateToken, updateReport);

module.exports = router;
