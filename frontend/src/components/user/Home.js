import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Brain, Camera, FileSearch, LogIn, Users, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../css/Home.css";

const Home = () => {
  const [reportDesc, setReportDesc] = useState("");
  const [message, setMessage] = useState("");
  const [incidents, setIncidents] = useState([]);
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role) setUserRole(user.role);
    if (user?.user_id || user?.id) setUserId(user.user_id || user.id);
  }, []);

  const fetchIncidents = useCallback(async () => {
    if (!token || !userId || (userRole !== "user" && userRole !== "student")) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/incidents/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncidents(res.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to fetch incidents");
    }
  }, [token, userId, userRole]);

  useEffect(() => {
    if (userId && (userRole === "user" || userRole === "student")) {
      fetchIncidents();
    }
  }, [userId, userRole, fetchIncidents]);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportDesc.trim()) return setMessage("❌ Issue description cannot be empty");

    try {
      await axios.post(
        "http://localhost:5000/api/incidents",
        { description: reportDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Report submitted successfully");
      setReportDesc("");
      fetchIncidents();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to submit report");
    }
  };

  const shortcuts = [
    { icon: <Camera size={28} />, title: "Dashboard", path: "/user/dashboard" },
    { icon: <FileSearch size={28} />, title: "My Incidents", path: "/user/incidents" },
    { icon: <LogIn size={28} />, title: "Submit Report", path: "/user/submit-report" },
    { icon: <Users size={28} />, title: "Profile", path: `/user/users/${userId || ""}` },
  ];

  return (
    <div className="home-container p-6">
      <motion.div className="home-header flex items-center mb-6">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mr-3"
        >
          <Brain size={28} />
        </motion.div>
        <motion.h1
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="text-2xl font-bold"
        >
          Campus AI
        </motion.h1>
      </motion.div>

      <div className="shortcut-grid grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {shortcuts.map((card, i) => (
          <Link
            key={i}
            to={card.path}
            className="shortcut-card border p-4 flex flex-col items-center justify-center rounded shadow hover:bg-blue-50 transition"
          >
            <div>{card.icon}</div>
            <div className="mt-2 font-medium">{card.title}</div>
          </Link>
        ))}
      </div>

      {(userRole === "student" || userRole === "user") && (
        <div className="report-section border p-4 rounded shadow">
          <h2 className="text-lg font-semibold flex items-center mb-3">
            <AlertTriangle size={22} className="mr-2" /> Report an Issue
          </h2>

          <form onSubmit={handleReportSubmit} className="mb-4">
            <textarea
              placeholder="Describe your issue..."
              value={reportDesc}
              onChange={(e) => setReportDesc(e.target.value)}
              className="w-full border p-2 rounded mb-2"
              rows={3}
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Submit Report
            </button>
          </form>

          {message && <p className="mb-3">{message}</p>}

          {incidents.length > 0 ? (
            <div className="user-reports">
              <h3 className="text-md font-semibold mb-2">Your Incidents</h3>
              {incidents.map((inc) => (
                <div key={inc.id} className="border p-3 mb-2 rounded bg-gray-50">
                  <strong>Issue:</strong> {inc.description} <br />
                  <strong>Status:</strong>{" "}
                  <span className={inc.status === "Closed" ? "text-green-600" : "text-red-600"}>
                    {inc.status}
                  </span>
                  <br />
                  <strong>Admin Comments:</strong> {inc.comments || "None"} <br />
                  <small>Created: {new Date(inc.timestamp).toLocaleString()}</small>
                </div>
              ))}
            </div>
          ) : (
            <p>No incidents reported yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
