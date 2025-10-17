// routes/logs.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/logController');

// Valid statuses
const validStatuses = [
  'authorized',
  'unauthorized',
  'visitor',
  'unrecognized',
  'liveness_failed',
  'face_not_found',
  'face_detected'
];

// Middleware to validate status
router.post('/', (req, res, next) => {
  const { status } = req.body;

  if (!validStatuses.includes(status.toLowerCase())) {
    return res.status(400).json({ message: `Invalid status value: "${status}". Must be one of ${validStatuses.join(', ')}` });
  }

  next();
}, controller.addLog);

// GET all logs
router.get('/', controller.getLogs);

module.exports = router;
