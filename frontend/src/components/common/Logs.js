// src/components/Logs.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:5000/api/logs');
      // Remove duplicates based on log_id
      const uniqueLogs = Array.from(
        new Map(res.data.map(log => [log.log_id, log])).values()
      );
      setLogs(uniqueLogs);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError('❌ Failed to fetch logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) return <p style={{ padding: '1rem' }}>🔄 Loading access logs...</p>;

  if (error) {
    return (
      <div style={{ padding: '1rem', color: 'red' }}>
        {error}
        <br />
        <button onClick={fetchLogs} style={{ marginTop: '10px' }}>
          Retry
        </button>
      </div>
    );
  }

  // Helper: Liveness passed if status is not 'liveness_failed'
  const renderLiveness = (status) => (status === 'liveness_failed' ? '❌' : '✅');

  // Helper: In database if user_id exists
  const renderInDatabase = (user_id) => (user_id ? '✅' : '❌');

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🔐 Campus Entry Logs</h2>
      {logs.length === 0 ? (
        <p style={{ padding: '1rem' }}>No logs found.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4' }}>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Timestamp</th>
              <th style={thStyle}>Attempt Type</th>
              <th style={thStyle}>Liveness</th>
              <th style={thStyle}>In Database</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr
                key={log.log_id}
                style={index % 2 === 0 ? rowStyleEven : rowStyleOdd}
              >
                <td style={tdStyle}>{index + 1}</td>
                <td style={tdStyle}>{log.person_name || 'Unknown'}</td>
                <td style={tdStyle}>
                  {log.entry_time
                    ? new Date(log.entry_time).toLocaleString()
                    : 'N/A'}
                </td>
                <td style={tdStyle}>
                  {log.user_id ? 'Authorized Person' : 'Unknown / Visitor'}
                </td>
                <td style={tdStyle}>{renderLiveness(log.status)}</td>
                <td style={tdStyle}>{renderInDatabase(log.user_id)}</td>
                <td style={tdStyle}>{log.status.replace('_', ' ').toUpperCase()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};


export default Logs;
