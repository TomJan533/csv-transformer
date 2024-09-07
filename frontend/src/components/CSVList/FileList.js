// src/components/FileList.js
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const FileList = ({ csvFiles, handleFileClick }) => {
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
      width: 150,
      renderCell: (params) => (
        <button onClick={() => handleFileClick(params.row.id)}>
          View Content
        </button>
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
      />
    </div>
  );
};

export default FileList;
