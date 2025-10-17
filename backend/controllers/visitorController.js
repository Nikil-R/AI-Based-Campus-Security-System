const Visitor = require("../models/visitor");
const QRCode = require("qrcode");
// Optional: Twilio integration
// const twilioClient = require("../utils/twilio");

const generateVisitorID = () => {
    return "VIS-" + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// ---------------- Visitor Registration ----------------
exports.registerVisitor = async (req, res) => {
    try {
        const { name, phone_number, id_type, id_number } = req.body;
        if (!name || !phone_number || !id_number) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Create unique visitor ID
        const visitor_id = generateVisitorID();

        // Save to DB
        const visitor = new Visitor({ name, phone_number, id_type, id_number, visitor_id });
        await visitor.save();

        // Generate QR code (as Data URL)
        const qrDataURL = await QRCode.toDataURL(visitor_id);

        // TODO: Send via WhatsApp using Twilio (optional)
        // await twilioClient.sendWhatsAppQRCode(phone_number, qrDataURL);

        return res.status(201).json({
            message: "Visitor registered successfully",
            visitor: visitor,
            qr: qrDataURL
        });

    } catch (err) {
        console.error("Registration Error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// ---------------- Scan / Entry-Exit ----------------
exports.scanVisitor = async (req, res) => {
    try {
        const { visitor_id, location } = req.body;
        if (!visitor_id) return res.status(400).json({ error: "visitor_id is required" });

        const visitor = await Visitor.findOne({ visitor_id });
        if (!visitor) return res.status(404).json({ error: "Visitor not found" });

        // Toggle status IN <-> OUT
        const action = visitor.status === "OUT" ? "ENTRY" : "EXIT";
        visitor.status = action === "ENTRY" ? "IN" : "OUT";
        await visitor.save();

        return res.json({
            message: `${action} logged for ${visitor.name}`,
            action: action,
            visitor: visitor
        });

    } catch (err) {
        console.error("Scan Error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// ---------------- Optional Check-In (Separate) ----------------
exports.checkInVisitor = async (req, res) => {
    try {
        const { visitor_id } = req.body;
        const visitor = await Visitor.findOne({ visitor_id });
        if (!visitor) return res.status(404).json({ error: "Visitor not found" });

        visitor.status = "IN";
        await visitor.save();

        return res.json({ message: "Check-in successful", visitor });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};
