import React, { Component } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Modal, Box, Paper } from '@mui/material';
import FileEnrichment from '../../pages/FileEnrichment/FileEnrichment.js';

class FileList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnrichmentModalOpen: false,
      selectedFileId: null,
    };

    this.openEnrichmentModal = this.openEnrichmentModal.bind(this);
    this.closeEnrichmentModal = this.closeEnrichmentModal.bind(this);
    this.handleEnrichmentSuccess = this.handleEnrichmentSuccess.bind(this);
  }

  // Function to open the modal and set the selected file ID
  openEnrichmentModal(fileId, event) {
    event.stopPropagation();
    this.setState({
      selectedFileId: fileId,
      isEnrichmentModalOpen: true,
    });
  }

  // Function to close the modal and refresh the file list
  closeEnrichmentModal() {
    this.setState({
      isEnrichmentModalOpen: false,
      selectedFileId: null,
    });
    this.props.refreshFileList();
  }

  // Function to handle the success of enrichment and refresh the list
  handleEnrichmentSuccess() {
    this.closeEnrichmentModal();
  }

  // Define columns for the DataGrid
  getColumns() {
    return [
      { field: 'file_name', headerName: 'File Name', width: 300 },
      {
        field: 'created_at',
        headerName: 'Last Updated',
        width: 200,
        valueGetter: (params) => {
          const date = new Date(params);
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
            {/* Button to view the content of the selected file */}
            <Button 
              onClick={(event) => {
                event.stopPropagation();
                this.props.handleFileClick(params.id);
              }}
              style={{
                marginRight: '10px',
                padding: '5px 10px',
                backgroundColor: '#1976d2',
                color: '#fff',
              }}
            >
              View Content
            </Button>
            
            {/* Button to open the modal for file enrichment */}
            <Button
              onClick={(event) => this.openEnrichmentModal(params.id, event)} // Pass the event
              style={{
                padding: '5px 10px',
                backgroundColor: '#f44336',
                color: '#fff',
              }}
            >
              Data Enrichment
            </Button>
          </div>
        ),
      },
    ];
  }

  render() {
    // Create rows for the DataGrid from csvFiles prop
    const fileRows = this.props.csvFiles.map((file) => ({
      id: file.id,
      file_name: file.file_name,
      created_at: file.created_at,
    }));

    return (
      <>
        <Paper sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={fileRows}
            columns={this.getColumns()}
            onRowClick={(params) => {
              this.props.handleFileClick(params.id); 
            }}
            pageSize={5}
            // checkboxSelection
            sx={{
              border: 0,
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
        </Paper>

        {/* Modal for File Enrichment */}
        <Modal
          open={this.state.isEnrichmentModalOpen}
          onClose={this.closeEnrichmentModal}
          aria-labelledby="file-enrichment-modal"
          aria-describedby="file-enrichment-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              maxHeight: '90vh',
              overflowY: 'auto',
              bgcolor: 'background.paper',
              borderRadius: '10px',
              boxShadow: 24,
              p: 4,
            }}
          >
            {/* Render FileEnrichment component within the modal if a file is selected */}
            {this.state.selectedFileId && (
              <FileEnrichment 
                fileId={this.state.selectedFileId} 
                onClose={this.handleEnrichmentSuccess}
              />
            )}
          </Box>
        </Modal>
      </>
    );
  }
}

export default FileList;
