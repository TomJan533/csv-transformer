import React, { useState, useEffect } from 'react';
import FileList from './FileList.js';
import Loading from './Loading.js';
import Error from './Error.js';

const CSVList = ({ onFileSelect }) => {
  const [csvFiles, setCsvFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/csv-files/`)
      .then(response => response.json())
      .then(data => {
        setCsvFiles(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  const handleFileClick = (fileId) => {
    fetch(`${process.env.REACT_APP_API_URL}/csv-files/${fileId}/?page=1&page_size=10`)
      .then(response => response.json())
      .then(data => {
        console.dir(data);
        const totalRows =data.count;
        onFileSelect(fileId, data.results, totalRows);
      })
      .catch((error) => {
        console.error('Error fetching file content:', error);
      });
  };

  return (
    <div>
      <FileList 
        csvFiles={csvFiles} 
        handleFileClick={handleFileClick} 
      />
    </div>
  );
};

export default CSVList;
