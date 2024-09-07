import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

const FileList = ({ csvFiles, handleFileClick }) => {
  const navigate = useNavigate();

  const fileColumns = [
    { field: 'file_name', headerName: 'File Name', width: 300 },
    {
      field: 'created_at',
      headerName: 'Uploaded At',
      width: 200,
      valueGetter: (params) => {
        const date = new Date(params.value);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div>
          <button 
            onClick={() => handleFileClick(params.id)}
            style={{
              marginRight: '10px',
              padding: '5px 10px',
              backgroundColor: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            View Content
          </button>
          
          {/* Button for Navigation to Data Enrichment */}
          <button
            onClick={() => navigate(`/file-enrichment/${params.id}`)}
            style={{
              padding: '5px 10px',
              backgroundColor: '#f44336',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Data Enrichment
          </button>
        </div>
      ),
    },
  ];

  const fileRows = csvFiles.map((file) => ({
    id: file.id,
    file_name: file.file_name,
    created_at: file.created_at,
  }));

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={fileRows}
        columns={fileColumns}
        onRowClick={(params) => {
          handleFileClick(params.id);
        }}
      />
    </div>
  );
};

export default FileList;
