// src/components/user/Settings.js
import React, { useState, useEffect } from "react";
import "../css/Settings.css";

export default function Settings() {
  // --------- Account Info ---------
  const [accountInfo, setAccountInfo] = useState({
    name: "",
    userId: "",
    department: "",
    role: "",
  });

  // --------- Preferences ---------
  const [preferences, setPreferences] = useState({
    theme: "dark",
    language: "English",
    timezone: "Asia/Kolkata",
  });

  // --------- Notifications ---------
  const [notifications, setNotifications] = useState({
    general: true,
    incidents: true,
    messages: false,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const storedPrefs = localStorage.getItem("userPreferences");
    const storedNotifs = localStorage.getItem("userNotifications");
    const storedAccount = JSON.parse(localStorage.getItem("user")) || {};

    if (storedPrefs) setPreferences(JSON.parse(storedPrefs));
    if (storedNotifs) setNotifications(JSON.parse(storedNotifs));
    if (storedAccount) {
      setAccountInfo({
        name: storedAccount.name || "",
        userId: storedAccount.userId || storedAccount.id || "",
        department: storedAccount.department || "N/A",
        role: storedAccount.role || "user",
      });
    }
  }, []);

  // --------- Apply theme in real-time ---------
  useEffect(() => {
    document.documentElement.className = preferences.theme; // Add class "light" or "dark" to <html>
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
  }, [preferences]);

  // --------- Handlers ---------
  const handlePrefChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotifToggle = (e) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSavePreferences = () => {
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
    localStorage.setItem("userNotifications", JSON.stringify(notifications));
    alert("✅ Preferences and Notifications saved.");
  };

  const handleChangePassword = () => {
    alert("Redirecting to Change Password page or modal...");
  };

  return (
    <div className={`settings-container max-w-4xl mx-auto p-6 ${preferences.theme}`}>
      <h2 className="text-2xl font-bold mb-6 text-center">User Settings</h2>

      {/* Account Details */}
      <div className="account-section bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Account Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Name:</label>
            <p>{accountInfo.name}</p>
          </div>
          <div>
            <label className="font-medium">User ID:</label>
            <p>{accountInfo.userId}</p>
          </div>
          <div>
            <label className="font-medium">Department:</label>
            <p>{accountInfo.department}</p>
          </div>
          <div>
            <label className="font-medium">Role:</label>
            <p>{accountInfo.role}</p>
          </div>
        </div>
        <button
          onClick={handleChangePassword}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Change Password
        </button>
        <p className="mt-2 text-sm text-gray-500">
          Note: For changes to Name, Department, or Role, contact Admin/HR.
        </p>
      </div>

      {/* Preferences */}
      <div className="preferences-section bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Preferences</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Theme:</label>
            <select
              name="theme"
              value={preferences.theme}
              onChange={handlePrefChange}
              className="p-2 border rounded w-full"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div>
            <label className="font-medium">Language:</label>
            <select
              name="language"
              value={preferences.language}
              onChange={handlePrefChange}
              className="p-2 border rounded w-full"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>

          <div>
            <label className="font-medium">Timezone:</label>
            <select
              name="timezone"
              value={preferences.timezone}
              onChange={handlePrefChange}
              className="p-2 border rounded w-full"
            >
              <option value="Asia/Kolkata">Asia/Kolkata</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="notifications-section bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Notifications</h3>
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="general"
              checked={notifications.general}
              onChange={handleNotifToggle}
            />
            General Alerts
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="incidents"
              checked={notifications.incidents}
              onChange={handleNotifToggle}
            />
            Incident Alerts
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="messages"
              checked={notifications.messages}
              onChange={handleNotifToggle}
            />
            Messages / Updates
          </label>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleSavePreferences}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded transition duration-200"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
