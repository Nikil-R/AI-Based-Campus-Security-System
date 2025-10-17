// controllers/logController.js
const db = require("../db/db");

// ✅ Save log to DB
exports.addLog = async (req, res) => {
  try {
    const { name, personId, timestamp, status, reason } = req.body;

    console.log("🔍 Incoming log request body:", req.body);

    const safeUserId = personId && !isNaN(personId) ? parseInt(personId) : null;
    const safeEntryTime = timestamp ? new Date(timestamp) : new Date();

    const sql = `
      INSERT INTO entry_logs (person_name, user_id, entry_time, status, remarks)
      VALUES (?, ?, ?, ?, ?)
    `;

    await db.query(sql, [
      name,
      safeUserId,
      safeEntryTime,
      status?.toLowerCase() || "unknown",
      reason || null,
    ]);

    res.status(200).send({ message: "✅ Log saved successfully" });
  } catch (err) {
    console.error("❌ Error saving log to DB:", err.message);
    res.status(500).send("Error saving log");
  }
};

// ✅ Get all logs
exports.getLogs = async (req, res) => {
  try {
    const sql = `
      SELECT l.log_id, l.person_name, l.user_id, u.name AS user_name,
             l.entry_time, l.status, l.remarks
      FROM entry_logs l
      LEFT JOIN users u ON l.user_id = u.id
      ORDER BY l.entry_time DESC
    `;
    const [rows] = await db.query(sql);
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error retrieving logs:", err.message);
    res.status(500).send("Error retrieving logs");
  }
};
