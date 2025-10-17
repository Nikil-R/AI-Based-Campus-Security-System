// src/components/user/Help.js
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Help({ currentUser }) {
  const [panicDetails, setPanicDetails] = useState("");
  const [sending, setSending] = useState(false);

  const handlePanic = async () => {
    if (!currentUser) return;
    setSending(true);

    try {
      const res = await axios.post("http://localhost:5000/api/alerts/panic", {
        user_id: currentUser.user_id,
        details: panicDetails,
        location: "Campus", // Replace with geolocation if needed
      });

      if (res.data.success) {
        toast.success("🚨 Panic alert sent!");
        setPanicDetails("");
      } else {
        toast.error("❌ Failed to send panic alert!");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to send panic alert!");
    }

    setSending(false);
  };

  return (
    <div className="help-container p-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Help & Emergency</h2>

      {/* Panic Section */}
      <div className="panic-section text-center mb-8">
        <button
          onClick={handlePanic}
          disabled={sending}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-6 px-12 rounded-full text-xl transition duration-200"
        >
          EMERGENCY 🚨
        </button>
        <textarea
          placeholder="Add details (optional)"
          value={panicDetails}
          onChange={(e) => setPanicDetails(e.target.value)}
          className="mt-4 w-full p-2 border rounded"
        />
      </div>

      {/* FAQ Section */}
      <div className="faq-section mb-8">
        <h3 className="text-2xl font-semibold mb-2">FAQ / Common Issues</h3>
        <ul className="list-disc pl-5">
          <li>System Access: How do I log in if I forget my password?</li>
          <li>Biometrics: My face is not recognized. What should I do?</li>
          <li>Incidents: How do I report a non-emergency incident? (See Incidents page)</li>
        </ul>
      </div>

      {/* Contact Support */}
      <div className="contact-section mb-8">
        <h3 className="text-2xl font-semibold mb-2">Contact Support</h3>
        <p>Campus Security Office (Non-Emergency): +91-9876543210 / security@campus.com</p>
        <p>IT Support (App/Technical Issues): +91-9876501234 / it-support@campus.com</p>
      </div>

      {/* System Info */}
      <div className="system-info">
        <h3 className="text-2xl font-semibold mb-2">System Information</h3>
        <p>System Status: Operational ✅</p>
        <p>App Version: v1.2.5</p>
      </div>
    </div>
  );
}
