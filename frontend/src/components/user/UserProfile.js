// src/components/user/UserProfile.js
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserProfile() {
  const [userData, setUserData] = useState({});
  const [activityData, setActivityData] = useState({
    totalEntries: 0,
    lastEntry: "",
    incidentsReported: 0,
    incidentsPending: 0,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch user account info
    const fetchUserData = async () => {
      try {
        const res = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    // Fetch activity overview
    const fetchActivityData = async () => {
      try {
        const res = await axios.get("/api/logs/user-activity", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActivityData(res.data);
      } catch (err) {
        console.error("Error fetching activity data:", err);
      }
    };

    fetchUserData();
    fetchActivityData();
  }, [token]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>

      {/* 1. Account Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Account Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Full Name:</label>
            <p>{userData.name || "-"}</p>
          </div>
          <div>
            <label className="font-medium">User ID:</label>
            <p>{userData.user_id || "-"}</p>
          </div>
          <div>
            <label className="font-medium">Role:</label>
            <p>{userData.role || "-"}</p>
          </div>
          <div>
            <label className="font-medium">Department/Zone:</label>
            <p>{userData.department || "-"}</p>
          </div>
          <div>
            <label className="font-medium">Account Created:</label>
            <p>{userData.created_at || "-"}</p>
          </div>
        </div>
      </div>

      {/* 2. Security Status */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Security Status</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Password Status:</label>
            <p>{userData.password_hash ? "Set" : "Requires Update"}</p>
          </div>
          <div>
            <label className="font-medium">Biometric (Face) Status:</label>
            <p>{userData.face_embedding ? "Registered" : "Enrollment Required"}</p>
          </div>
          <div className="col-span-2 mt-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => window.location.href = "/settings"}
            >
              Manage Security
            </button>
          </div>
        </div>
      </div>

      {/* 3. Activity Overview */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Activity Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Total Entries Logged:</label>
            <p>{activityData.totalEntries}</p>
          </div>
          <div>
            <label className="font-medium">Last Entry Time:</label>
            <p>{activityData.lastEntry || "-"}</p>
          </div>
          <div>
            <label className="font-medium">Incidents Reported:</label>
            <p>{activityData.incidentsReported}</p>
          </div>
          <div>
            <label className="font-medium">Incidents Pending:</label>
            <p>{activityData.incidentsPending}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
