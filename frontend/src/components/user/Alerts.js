import React, { useState, useEffect } from "react";
import { Bell, CheckCircle, AlertTriangle, User, Info } from "lucide-react";
import axios from "axios";


const Alerts = ({ userId }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch alerts for the current user
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get(`/api/alerts/user/${userId}`);
        setAlerts(response.data);
      } catch (err) {
        console.error("Error fetching alerts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, [userId]);

  if (loading) {
    return (
      <div className="alerts-container">
        <div className="loading">Fetching your alerts...</div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="alerts-container">
        <div className="no-alerts">
          <Bell size={40} className="text-gray-400 mb-2" />
          <p>No alerts right now. Stay safe and stay alert.</p>
        </div>
      </div>
    );
  }

  // Utility for alert icon
  const getIcon = (type) => {
    switch (type) {
      case "incident":
        return <AlertTriangle className="text-red-500" size={22} />;
      case "access":
        return <User className="text-blue-500" size={22} />;
      case "emergency":
        return <AlertTriangle className="text-orange-500" size={22} />;
      case "visitor":
        return <Info className="text-green-500" size={22} />;
      case "system":
        return <Bell className="text-purple-500" size={22} />;
      default:
        return <Info className="text-gray-400" size={22} />;
    }
  };

  // Utility for background color
  const getBg = (type) => {
    switch (type) {
      case "incident":
        return "bg-red-100";
      case "access":
        return "bg-blue-100";
      case "emergency":
        return "bg-orange-100";
      case "visitor":
        return "bg-green-100";
      case "system":
        return "bg-purple-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="alerts-container p-6">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <Bell className="text-yellow-500" /> Your Alerts
      </h2>

      <div className="alerts-list flex flex-col gap-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`alert-item flex items-start gap-3 p-4 rounded-xl shadow-sm ${getBg(
              alert.type
            )}`}
          >
            <div className="icon">{getIcon(alert.type)}</div>
            <div className="alert-content">
              <h3 className="font-medium text-gray-800">{alert.title}</h3>
              <p className="text-gray-600 text-sm mb-1">{alert.message}</p>
              <span className="text-xs text-gray-500">
                {new Date(alert.timestamp).toLocaleString()}
              </span>
            </div>
            {alert.status === "resolved" && (
              <CheckCircle
                size={20}
                className="ml-auto text-green-500"
                title="Resolved"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
