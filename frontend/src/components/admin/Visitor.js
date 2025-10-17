import React, { useState } from "react";
import axios from "axios";
import { QrReader } from "react-qr-scanner";
import "../css/Visitor.css"; // Assuming a CSS file for styling

const ID_TYPES = ["Aadhaar", "Passport", "Driver's License", "Student ID", "Other"];

export default function Visitor() {
  const [visitorData, setVisitorData] = useState({
    name: "",
    phone_number: "",
    id_type: ID_TYPES[0],
    id_number: ""
  });
  const [message, setMessage] = useState("");
  const [scanToken, setScanToken] = useState("");
  const [scanResultAction, setScanResultAction] = useState("");

  const handleChange = (e) => {
    setVisitorData({ ...visitorData, [e.target.name]: e.target.value });
  };

  // ---------------- 1. Visitor Registration ----------------
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("Submitting data and sending QR via WhatsApp...");

    if (!visitorData.name || !visitorData.phone_number || !visitorData.id_number) {
      setMessage("❌ Please fill in all required fields.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/visitor/register",
        visitorData
      );
      setMessage(`✅ Registration successful! QR sent to ${res.data.visitor.phone_number} via WhatsApp.`);
    } catch (err) {
      console.error("Registration Error:", err.response?.data || err.message);
      setMessage(err.response?.data?.error || "❌ Registration failed. Check backend logs.");
    }
  };

  // ---------------- 2. Scan QR (Entry/Exit) ----------------
  const handleScan = async (token) => {
    if (!token || token === scanToken) return;

    setScanToken(token);
    setMessage("Verifying QR for Entry/Exit...");
    setScanResultAction("");

    try {
      const res = await axios.post("http://localhost:5000/api/security/scan", {
        visitor_id: token,
        location: "Main Gate"
      });

      const action = res.data.action || "LOGGED";
      const name = res.data.visitor.name || "Visitor";

      setScanResultAction(action);

      if (action === "ENTRY") setMessage(`🟢 ACCESS GRANTED! Entry logged for ${name}.`);
      else if (action === "EXIT") setMessage(`🔵 DEPARTURE LOGGED! Exit complete for ${name}.`);
      else setMessage(`✨ Action Logged: ${name} (${action})`);

    } catch (err) {
      console.error("Scan Error:", err.response?.data || err.message);
      setMessage(err.response?.data?.error || "❌ Scan failed. Invalid or expired QR.");
      setScanToken("");
      setScanResultAction("");
    }
  };

  return (
    <div className="visitor-container p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Visitor Security Management System</h2>

      {/* Registration Form */}
      <div className="registration-section bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">New Visitor Registration</h3>
        <form className="grid grid-cols-2 gap-4" onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={visitorData.name}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="tel"
            name="phone_number"
            placeholder="Phone Number (e.g., +919876543210)"
            value={visitorData.phone_number}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <select
            name="id_type"
            value={visitorData.id_type}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          >
            {ID_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <input
            type="text"
            name="id_number"
            placeholder="ID Number"
            value={visitorData.id_number}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <button type="submit" className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200">
            Generate QR & Send via WhatsApp
          </button>
        </form>
      </div>

      <hr className="my-8" />

      {/* QR Scanner */}
      <div className="scanner-section bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Gate Access Scanner (DroidCam Required)</h3>
        <div className="flex justify-center mb-4">
          <div className="qr-reader-wrapper border-4 border-gray-300 rounded overflow-hidden" style={{ width: "300px", height: "250px" }}>
            <QrReader
              onResult={(result, error) => {
                if (!!result) handleScan(result?.text);
              }}
              constraints={{ facingMode: "environment" }}
              videoStyle={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-500 mb-2">Instructions: Visitor displays WhatsApp QR to the camera above.</p>

          {message && <p className="text-lg font-bold mt-2 text-green-700">{message}</p>}

          {scanResultAction && (
            <p className={`text-2xl font-extrabold mt-3 p-2 rounded ${
              scanResultAction === "ENTRY" ? "bg-green-200 text-green-800" :
              scanResultAction === "EXIT" ? "bg-blue-200 text-blue-800" : "bg-yellow-200 text-yellow-800"
            }`}>
              {scanResultAction === "ENTRY" ? "ACCESS GRANTED" :
               scanResultAction === "EXIT" ? "DEPARTURE LOGGED" : "SCAN COMPLETE"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
