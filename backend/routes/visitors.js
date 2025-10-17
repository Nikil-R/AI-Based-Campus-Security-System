const express = require("express");
const router = express.Router();
const visitorController = require("../controllers/visitorController");

// Visitor Registration
router.post("/register", visitorController.registerVisitor);

// QR Scan / Entry-Exit
router.post("/scan", visitorController.scanVisitor);

// Optional: visitor check-in/check-out (if separate from scan)
router.post("/checkin", visitorController.checkInVisitor);

module.exports = router;
