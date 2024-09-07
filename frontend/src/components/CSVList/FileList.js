import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

const FileList = ({ csvFiles, handleFileClick, selectionModel, setSelectionModel }) => {
  const navigate = useNavigate(); // useNavigate hook for redirection

  const fileColumns = [
    { field: 'file_name', headerName: 'File Name', width: 300 },
    {
      field: 'created_at',
      headerName: 'Uploaded At',
      width: 200,
      valueGetter: (params) => {
        const date = new Date(params);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300, // Adjust width to accommodate both buttons
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
          
          {/* New Button for Navigation to Data Enrichment */}
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
    created_at: file.created_at || null,
  }));

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={fileRows}
        columns={fileColumns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 25]}
        selectionModel={selectionModel} // Bind to selectionModel state
        onSelectionModelChange={(newSelection) => {
          const selectedId = newSelection[0];
          setSelectionModel(newSelection); // Update the selection
          handleFileClick(selectedId); // Trigger file click for selection
        }}
        onRowClick={(params) => {
          handleFileClick(params.id); // Handle row click to trigger ViewContent action
        }}
      />
    </div>
  );
};

export default FileList;
