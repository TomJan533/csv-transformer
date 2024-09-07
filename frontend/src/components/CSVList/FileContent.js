import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const FileContent = ({ selectedFileContent, fileName }) => {
  const contentColumns = selectedFileContent
    ? Object.keys(selectedFileContent[0]).map((key) => ({
        field: key,
        headerName: key,
        width: 150,
      }))
    : [];

  const contentRows = selectedFileContent
    ? selectedFileContent.map((row, index) => ({
        id: index,
        ...row,
      }))
    : [];

  return (
    <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
      <h3>File Content for {fileName}</h3>
      <DataGrid
        rows={contentRows}
        columns={contentColumns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

export default FileContent;
