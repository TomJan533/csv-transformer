import React, { useState, useEffect } from 'react';

const apiUrl = process.env.REACT_APP_API_URL;

const UserActionLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logs from the backend API
  const fetchLogs = async () => {
    try {
      const response = await fetch(`${apiUrl}/logs/`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }

      const data = await response.json();
      setLogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Use effect to fetch logs when the component loads
  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) {
    return <div>Loading logs...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>User Action Logs</h2>
      <ul>
        {logs.map(log => (
          <li key={log.id}>
            {log.action} - {new Date(log.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserActionLogs;
