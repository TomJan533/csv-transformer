import React, { useEffect, useState } from 'react';

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
    <div>
      <h1>Health Check Status</h1>
      {status ? (
        <pre>{JSON.stringify(status, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default HealthCheck;
