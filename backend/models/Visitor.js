const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone_number: { type: String, required: true },
    id_type: { type: String, required: true },
    id_number: { type: String, required: true },
    visitor_id: { type: String, unique: true }, // QR token
    status: { type: String, enum: ["OUT", "IN"], default: "OUT" },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Visitor", visitorSchema);
