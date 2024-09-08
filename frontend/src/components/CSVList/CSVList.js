import React, { useState, useEffect } from 'react';
import FileList from './FileList.js';
import Loading from './Loading.js';
import Error from './Error.js';

const CSVList = ({ onFileSelect, updateTrigger, refreshFileList }) => {
  const [csvFiles, setCsvFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCSVFiles = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/csv-files/`);
        const data = await response.json();
        setCsvFiles(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCSVFiles(); // Fetch the list on component mount and when updateTrigger changes
  }, [updateTrigger]); // Depend on `updateTrigger` to re-fetch files after a file upload

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  const handleFileClick = (fileId) => {
    fetch(`${process.env.REACT_APP_API_URL}/csv-files/${fileId}/?page=1&page_size=10`)
      .then(response => response.json())
      .then(data => {
        const totalRows = data.count;
        onFileSelect(fileId, data.results, totalRows); // Pass fileId, content, and total rows
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
        refreshFileList={refreshFileList}  // Pass refreshFileList to FileList
      />
    </div>
  );
};

export default CSVList;
