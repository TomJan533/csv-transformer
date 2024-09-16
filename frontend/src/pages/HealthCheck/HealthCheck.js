import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout.js';
import UserActionLogs from '../../components/UserActionLogs/UserActionLogs.js';

const apiUrl = process.env.REACT_APP_API_URL;

const HealthCheck = () => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Fetch health check from the backend
    fetch(`${apiUrl}/health-check/`)
      .then((response) => response.json())
      .then((data) => setStatus(data))
      .catch((error) => {
        console.error('Error fetching health check:', error);
        setStatus({ status: 'Error' });
      });
  }, []);

  return (
    <Layout>
      <h1>Health Check Status</h1>
      {status ? (
        <pre>{JSON.stringify(status, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
      <UserActionLogs />
    </Layout>
  );
};

export default HealthCheck;
