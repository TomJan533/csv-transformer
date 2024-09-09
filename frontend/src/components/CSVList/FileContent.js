import React, { Component } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper } from '@mui/material'; // Import Paper for styling

class FileContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paginationModel: {
        page: 0,
        pageSize: 10,
      },
      data: [],
      rowCount: 0,
    };

    this.handlePaginationChange = this.handlePaginationChange.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.paginationModel.page !== this.state.paginationModel.page ||
      prevState.paginationModel.pageSize !== this.state.paginationModel.pageSize
    ) {
      this.fetchData();
    }
  }

  // Method to fetch data based on the pagination model
  fetchData() {
    const { page, pageSize } = this.state.paginationModel;
    this.props.fetchPaginatedData(page + 1, pageSize).then((response) => {
      this.setState({
        data: response.results,
        rowCount: response.count,
      });
    });
  }

  // Handle pagination model change
  handlePaginationChange(newPaginationModel) {
    this.setState({
      paginationModel: newPaginationModel,
    });
  }

  // Automatically generate columns from the first row of data
  generateColumns() {
    const { data } = this.state;
    return data.length > 0
      ? Object.keys(data[0]).map((key) => ({
          field: key,
          headerName: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize header
          width: 150,
        }))
      : [];
  }

  render() {
    const { data, rowCount, paginationModel } = this.state;
    const columns = this.generateColumns();

    return (
      <Paper sx={{ p: 2, borderRadius: 2, elevation: 3 }}> {/* Paper wrapper for styling */}
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={data}
            columns={columns}
            paginationMode="server"
            rowCount={rowCount}
            getRowId={(row) => row.impression_id || row.id}
            pagination
            pageSizeOptions={[10, 25, 50, 100]}
            onPaginationModelChange={this.handlePaginationChange}
            paginationModel={paginationModel}
            sx={{
              border: 0, // Remove border
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f0f0f0',
                fontWeight: 'bold',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold',
              },
              '& .MuiDataGrid-cell': {
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
              },
            }}
          />
        </div>
      </Paper>
    );
  }
}

export default FileContent;
