// src/components/admin/AdminAlerts.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";
import '../css/AdminAlerts.css';

const socket = io("http://localhost:5000");

export default function AdminAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    socket.on("new-panic-alert", (alert) => {
      setAlerts(prev => [alert, ...prev]);
      toast.error(`🚨 Panic Alert from ${alert.user_id}`);
    });

    return () => socket.off("new-panic-alert");
  }, []);

  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="admin-alerts-container">
      <h2>
        Admin Alerts Dashboard
        {alerts.length > 0 && <span className="alerts-count">{alerts.length}</span>}
      </h2>

      {alerts.length === 0 && <p>No alerts yet.</p>}

      <ul className="alerts-list">
        {alerts.map((alert, index) => (
          <li key={alert._id || index} className="alert-card">
            <div className="alert-header">
              <div className="alert-user">{alert.user_id}</div>
              <div className="alert-time">{formatTime(alert.timestamp)}</div>
            </div>

            <div className="alert-status">Active Alert</div>

            <div className="alert-location">
              {alert.location || "Location not specified"}
            </div>

            {alert.details && (
              <div className="alert-details">
                {alert.details}
              </div>
            )}

            <div className="alert-actions">
              <button className="alert-btn alert-btn-acknowledge">
                Acknowledge
              </button>
              <button className="alert-btn alert-btn-dismiss">
                Dismiss
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}