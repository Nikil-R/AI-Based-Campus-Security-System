const express = require("express");
const router = express.Router();
const { registerPerson } = require("../controllers/registerController");

router.post("/register", registerPerson);

module.exports = router;
