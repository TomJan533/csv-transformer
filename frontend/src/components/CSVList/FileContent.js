import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const FileContent = ({ fetchPaginatedData }) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [data, setData] = useState([]);
  const [rowCount, setRowCount] = useState(0);

  useEffect(() => {
    // Fetch data when pagination changes
    fetchPaginatedData(paginationModel.page + 1, paginationModel.pageSize).then(
      (response) => {
        setData(response.results);
        setRowCount(response.count);
      }
    );
  }, [paginationModel, fetchPaginatedData]);

  // Automatically generate columns from the first row of data
  const columns = data.length > 0 
    ? Object.keys(data[0]).map((key) => ({
        field: key,
        headerName: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize header
        width: 150,
      }))
    : [];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        paginationMode="server"
        rowCount={rowCount}
        getRowId={(row) => row.impression_id || row.id} // Use a unique identifier from data
        pagination
        pageSizeOptions={[10, 25, 50, 100]}
        onPaginationModelChange={(newPaginationModel) => {
          setPaginationModel(newPaginationModel);
        }}
        paginationModel={paginationModel}
      />
    </div>
  );
};

export default FileContent;
