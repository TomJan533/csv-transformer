import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';

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
        onFileSelect(data, fileId); // Notify parent component with both content and fileId
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

  // Columns for the file list DataGrid
  const fileColumns = [
    { field: 'file_name', headerName: 'File Name', width: 300 },
    {
      field: 'created_at',
      headerName: 'Uploaded At',
      width: 200,
      valueGetter: (params) => {
        const date = new Date(params);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        return formattedDate;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <button onClick={() => handleFileClick(params.row.id)}>
          View Content
        </button>
      ),
    },
  ];

  // Rows for the file list DataGrid
  const fileRows = csvFiles.map((file) => ({
    id: file.id,
    file_name: file.file_name,
    created_at: file.created_at || null,
  }));

  // Columns and rows for selected file content (CSV file content)
  const contentColumns = selectedFileContent
    ? Object.keys(selectedFileContent[0]).map((key) => ({
        field: key,
        headerName: key,
        width: 150,
      }))
    : [];

  const contentRows = selectedFileContent
    ? selectedFileContent.map((row, index) => ({
        id: index, // A unique ID is required for DataGrid rows
        ...row,
      }))
    : [];

  return (
    <div>
      {/* File List DataGrid */}
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={fileRows}
          columns={fileColumns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </div>

      {/* CSV File Content DataGrid */}
      {selectedFileContent && (
        <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
          <h3>File Content for {csvFiles.find(file => file.id === selectedFileId)?.file_name}</h3>
          <DataGrid
            rows={contentRows}
            columns={contentColumns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </div>
      )}
    </div>
  );
}

export default CSVList;
