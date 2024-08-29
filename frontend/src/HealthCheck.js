import React, { useEffect, useState } from 'react';

const HealthCheck = () => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Fetch health check from the backend
    fetch('http://localhost:8000/api/health-check/') // TODO: replace with app config
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
