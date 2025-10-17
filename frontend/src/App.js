// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "./components/user/Sidebar";
import AdminSidebar from "./components/admin/AdminSidebar";
import Navbar from "./components/common/Navbar";

import Dashboard from "./components/admin/Dashboard";
import Home from "./components/user/Home";
import AdminHome from "./components/admin/AdminHome";
import Login from "./components/user/Login";
import UserProfile from "./components/user/UserProfile";
import PrivateRoute from "./components/common/PrivateRoute";
import AddPerson from "./components/admin/AddPerson";
import ManageUsers from "./components/admin/ManageUsers";
import LiveFeed from "./components/admin/LiveFeed";
import Visitor from "./components/admin/Visitor";
import Incidents from "./components/user/Incidents";
import AdminIncidents from "./components/admin/AdminIncidents";
import Alerts from "./components/user/Alerts";
import AdminAlerts from "./components/admin/AdminAlerts";
import Settings from "./components/user/Settings";
import Help from "./components/user/Help";

import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Preferences: theme, language, timezone
  const [preferences, setPreferences] = useState({
    theme: "light", // default light
    language: "en",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  // Load user and preferences from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedPrefs = localStorage.getItem("preferences");
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
    if (storedPrefs) setPreferences(JSON.parse(storedPrefs));
  }, []);

  // Apply theme class to body
  useEffect(() => {
    document.body.className = preferences.theme === "dark" ? "dark-mode" : "light-mode";
  }, [preferences.theme]);

  const token = localStorage.getItem("token");
  const role = currentUser?.role || null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  // Fetch users for Navbar search
  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("❌ Failed to fetch users:", err);
        handleLogout();
      }
    };

    fetchUsers();
  }, [token]);

  if (!token || !currentUser) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={2000} theme="dark" />
      </Router>
    );
  }

  const isUser = ["user", "student", "staff"].includes(role);
  const isAdmin = role === "admin";

  return (
    <Router>
      <div className="app-container flex">
        {isAdmin ? <AdminSidebar /> : <Sidebar />}
        <div className="main-content flex-1">
          <Navbar users={users} handleLogout={handleLogout} preferences={preferences} />

          <Routes>
            {/* ---------- USER ROUTES ---------- */}
            {isUser && (
              <>
                <Route
                  path="/user/home"
                  element={<PrivateRoute role="user"><Home /></PrivateRoute>}
                />
                <Route
                  path="/user/dashboard"
                  element={<PrivateRoute role="user"><Dashboard /></PrivateRoute>}
                />
                <Route
                  path="/user/profile"
                  element={<PrivateRoute role="user"><UserProfile /></PrivateRoute>}
                />
                <Route
                  path="/user/visitors"
                  element={<PrivateRoute role="user"><Visitor /></PrivateRoute>}
                />
                <Route
                  path="/user/incidents"
                  element={<PrivateRoute role="user"><Incidents /></PrivateRoute>}
                />
                <Route
                  path="/user/live-feed"
                  element={<PrivateRoute role="user"><LiveFeed /></PrivateRoute>}
                />
                <Route
                  path="/user/alerts"
                  element={<PrivateRoute role="user"><Alerts /></PrivateRoute>}
                />
                <Route
                  path="/user/settings"
                  element={
                    <PrivateRoute role="user">
                      <Settings preferences={preferences} setPreferences={setPreferences} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/user/help"
                  element={<PrivateRoute role="user"><Help currentUser={currentUser} /></PrivateRoute>}
                />
                <Route path="*" element={<Navigate to="/user/home" replace />} />
              </>
            )}

            {/* ---------- ADMIN ROUTES ---------- */}
            {isAdmin && (
              <>
                <Route
                  path="/admin/home"
                  element={<PrivateRoute role="admin"><AdminHome /></PrivateRoute>}
                />
                <Route
                  path="/admin/dashboard"
                  element={<PrivateRoute role="admin"><Dashboard /></PrivateRoute>}
                />
                <Route
                  path="/admin/live-feed"
                  element={<PrivateRoute role="admin"><LiveFeed /></PrivateRoute>}
                />
                <Route
                  path="/admin/add-person"
                  element={<PrivateRoute role="admin"><AddPerson /></PrivateRoute>}
                />
                <Route
                  path="/admin/manage-users"
                  element={<PrivateRoute role="admin"><ManageUsers /></PrivateRoute>}
                />
                <Route
                  path="/admin/visitors"
                  element={<PrivateRoute role="admin"><Visitor /></PrivateRoute>}
                />
                <Route
                  path="/admin/incidents"
                  element={<PrivateRoute role="admin"><AdminIncidents /></PrivateRoute>}
                />
                <Route
                  path="/admin/alerts"
                  element={<PrivateRoute role="admin"><AdminAlerts /></PrivateRoute>}
                />
                <Route
                  path="/admin/settings"
                  element={
                    <PrivateRoute role="admin">
                      <Settings preferences={preferences} setPreferences={setPreferences} />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/admin/home" replace />} />
              </>
            )}
          </Routes>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} theme="dark" />
    </Router>
  );
}

export default App;
