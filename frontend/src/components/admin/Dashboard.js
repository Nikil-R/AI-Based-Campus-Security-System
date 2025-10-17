// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import '../css/Dashboard.css';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token'); // JWT token
      if (!token) {
        navigate('/login'); // redirect to login if no token
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/logs', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          // Unauthorized, token invalid
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        const data = await res.json();
        // Remove duplicate logs based on log_id
        const uniqueLogs = Array.from(new Map(data.map(log => [log.log_id, log])).values());
        setLogs(uniqueLogs);
      } catch (err) {
        console.error('Failed to fetch logs:', err);
        setError('Failed to fetch logs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [navigate]);

  const getStatusData = (log) => {
    const status = log.status?.toUpperCase();
    const isNameKnown = log.person_name && log.person_name !== 'Unknown';

    let attemptType, livenessPassed, faceRegistered, statusText, statusColor;

    if (status === 'LIVENESS_FAILED') {
      attemptType = 'Fake Attempt ❌';
      livenessPassed = '❌';
      faceRegistered = isNameKnown ? '✅' : '❌';
      statusText = 'Liveness Failed';
      statusColor = 'red';
    } else if (status === 'UNRECOGNIZED') {
      attemptType = 'Unknown Person 🚫';
      livenessPassed = '✅';
      faceRegistered = '❌';
      statusText = 'Unrecognized Face';
      statusColor = '#ff9800';
    } else if (status === 'AUTHORIZED') {
      attemptType = 'Authorized Access ✅';
      livenessPassed = '✅';
      faceRegistered = '✅';
      statusText = 'Access Granted';
      statusColor = 'green';
    } else {
      attemptType = 'Unknown ❓';
      livenessPassed = '❓';
      faceRegistered = '❓';
      statusText = 'Unknown Status';
      statusColor = 'gray';
    }

    return { attemptType, livenessPassed, faceRegistered, statusText, statusColor };
  };

  return (
    <div className="dashboard">
      <h2>📋 Campus Entry Logs</h2>

      {loading ? (
        <p>Loading logs...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : logs.length === 0 ? (
        <p>No entry logs found.</p>
      ) : (
        <div className="table-container">
          <table className="log-table">
            <thead>
              <tr>
                <th>🧑 Name</th>
                <th>🕓 Timestamp</th>
                <th>🔍 Attempt Type</th>
                <th>👁️‍🗨️ Liveness</th>
                <th>📁 In Database</th>
                <th>✅ Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice().reverse().map((log, index) => {
                const { attemptType, livenessPassed, faceRegistered, statusText, statusColor } =
                  getStatusData(log);

                return (
                  <tr key={log.log_id || index}>
                    <td><strong>{log.person_name || 'Unknown'}</strong></td>
                    <td>{log.entry_time ? new Date(log.entry_time).toLocaleString() : 'N/A'}</td>
                    <td>{attemptType}</td>
                    <td>{livenessPassed}</td>
                    <td>{faceRegistered}</td>
                    <td style={{ color: statusColor, fontWeight: 'bold' }}>{statusText}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
