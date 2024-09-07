import { useState, useEffect } from 'react';

const apiUrl = process.env.REACT_APP_API_URL;

export const useFetchCSVFiles = () => {
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

  return { csvFiles, loading, error };
};
