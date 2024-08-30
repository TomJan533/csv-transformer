import React, { useState, useEffect } from 'react';

const apiUrl = process.env.REACT_APP_API_URL;

function CSVList() {
  const [csvFiles, setCsvFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${apiUrl}/csv-files/`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch CSV files');
        }
        return response.json();
      })
      .then(data => {
        setCsvFiles(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>CSV Files</h2>
      <ul>
        {csvFiles.map(file => (
          <li key={file.id}>
            {file.file_name} - Uploaded at: {new Date(file.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CSVList;
