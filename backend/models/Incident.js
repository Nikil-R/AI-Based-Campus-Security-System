// models/Incident.js
const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  severity: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false },
  resolvedAt: { type: Date },
});

module.exports = mongoose.model("Incident", incidentSchema);
