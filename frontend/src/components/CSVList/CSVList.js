import React, { useState, useEffect } from 'react';

const apiUrl = process.env.REACT_APP_API_URL;

function CSVList({ onFileSelect }) {
  const [csvFiles, setCsvFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFileContent, setSelectedFileContent] = useState(null);
  const [selectedFileId, setSelectedFileId] = useState(null);

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

  const handleFileClick = (fileId) => {
    setSelectedFileId(fileId);
    setLoading(true);
    fetch(`${apiUrl}/csv-files/${fileId}/`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch file content');
        }
        return response.json();
      })
      .then(data => {
        setSelectedFileContent(data);
        setLoading(false);
        onFileSelect(data, fileId); // Notify App component with both content and fileId
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };

  if (loading && selectedFileId === null) {
    return <div>Loading file list...</div>;
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
            <button onClick={() => handleFileClick(file.id)}>
              {file.file_name} - Uploaded at: {new Date(file.created_at).toLocaleString()}
            </button>
          </li>
        ))}
      </ul>
      
      {selectedFileContent && selectedFileContent.length > 0 && (
        <div>
          <h3>File Content for {csvFiles.find(file => file.id === selectedFileId)?.file_name}</h3>
          <table>
            <thead>
              <tr>
                {Object.keys(selectedFileContent[0]).map(header => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectedFileContent.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, idx) => (
                    <td key={idx}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CSVList;
