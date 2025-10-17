import React, { useState, useEffect } from "react";
import "../css/AdminHome.css";
import { motion } from "framer-motion";
import {
  Brain,
  FileSearch,
  Users,
  Shield,
  BarChart3,
  AlertTriangle,
  LayoutDashboard,
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminHome = () => {
  const shortcuts = [
    { icon: <LayoutDashboard size={28} />, title: "Dashboard", path: "/admin/dashboard" },
    { icon: <FileSearch size={28} />, title: "Manage Reports", path: "/admin/reports" },
    { icon: <Users size={28} />, title: "Manage Users", path: "/admin/manage-users" },
    { icon: <BarChart3 size={28} />, title: "Analytics Dashboard", path: "/admin/analytics" },
    { icon: <Shield size={28} />, title: "Security Monitoring", path: "/admin/security" },
  ];

  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAllReports = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("❌ You are not logged in");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/incidents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch reports");

      setReports(data);
      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReports();
  }, []);

  return (
    <div className="home-container p-6">
      {/* Header */}
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
          Admin Dashboard
        </motion.h1>
      </motion.div>

      {/* Shortcuts */}
      <div className="shortcut-grid grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {shortcuts.map((card, i) => (
          <Link
            to={card.path}
            key={i}
            className="shortcut-card border p-4 flex flex-col items-center justify-center rounded shadow hover:bg-blue-50 transition"
          >
            <div>{card.icon}</div>
            <div className="mt-2 font-medium">{card.title}</div>
          </Link>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="report-section border p-4 rounded shadow">
        <h2 className="text-lg font-semibold flex items-center mb-3">
          <AlertTriangle size={22} className="mr-2" /> Recent Reports
        </h2>

        {loading && <p>Loading reports...</p>}
        {message && <p>{message}</p>}

        {!loading && reports.length > 0 ? (
          <div className="user-reports">
            {reports.slice(0, 5).map((r) => (
              <div key={r.id} className="border p-3 mb-2 rounded bg-gray-50">
                <strong>User:</strong> {r.user_name || r.user_id} <br />
                <strong>Issue:</strong> {r.description || r.issue} <br />
                <strong>Status:</strong>{" "}
                <span className={r.status === "resolved" ? "text-green-600" : "text-red-600"}>
                  {r.status}
                </span>
                <br />
                <strong>Admin Comments:</strong> {r.comments || "None"} <br />
                <small>Created: {new Date(r.timestamp || r.created_at).toLocaleString()}</small>
              </div>
            ))}
            <p className="mt-2">
              … <Link to="/admin/reports" className="text-blue-600 hover:underline">View all reports</Link>
            </p>
          </div>
        ) : (
          !loading && <p>No reports found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
