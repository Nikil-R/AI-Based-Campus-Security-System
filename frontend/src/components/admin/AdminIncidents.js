import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import '../css/AdminIncidents.css';

export default function AdminIncidents() {
  const token = localStorage.getItem("token");
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIncidents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/incidents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncidents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const resolveIncident = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/incidents/${id}`,
        { status: "resolved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchIncidents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="incidents-container">
      <h2>All Reported Incidents</h2>

      <div className="table-wrapper">
        {loading ? (
          <div className="loading-state">Loading incidents...</div>
        ) : incidents.length === 0 ? (
          <div className="empty-state">No incidents reported yet.</div>
        ) : (
          <table className="incidents-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Reported By</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc) => (
                <tr key={inc.id}>
                  <td>{inc.id}</td>
                  <td>{inc.title}</td>
                  <td>{inc.description}</td>
                  <td>
                    <span className={inc.status === "resolved" ? "status-resolved" : "status-pending"}>
                      {inc.status}
                    </span>
                  </td>
                  <td>{inc.reported_by}</td>
                  <td>{new Date(inc.timestamp).toLocaleString()}</td>
                  <td>
                    {inc.status !== "resolved" && (
                      <button
                        onClick={() => resolveIncident(inc.id)}
                        className="resolve-button"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}