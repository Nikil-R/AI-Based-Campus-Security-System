// models/VisitorLog.js
const mongoose = require("mongoose");

const visitorLogSchema = new mongoose.Schema({
  visitor: { type: mongoose.Schema.Types.ObjectId, ref: "Visitor", required: true },
  action: { type: String, enum: ["ENTRY", "EXIT"], required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("VisitorLog", visitorLogSchema);
