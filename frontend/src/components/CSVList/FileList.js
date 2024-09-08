import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Modal, Box } from '@mui/material';
import FileEnrichment from '../../pages/FileEnrichment/FileEnrichment.js';

const FileList = ({ csvFiles, handleFileClick, refreshFileList }) => {
  const [isEnrichmentModalOpen, setIsEnrichmentModalOpen] = useState(false); // State to manage modal open/close
  const [selectedFileId, setSelectedFileId] = useState(null); // Track selected file for enrichment

  // Function to open the modal and set the selected file ID
  const openEnrichmentModal = (fileId) => {
    setSelectedFileId(fileId);
    setIsEnrichmentModalOpen(true);
  };

  // Function to close the modal and refresh the file list
  const closeEnrichmentModal = () => {
    setIsEnrichmentModalOpen(false);
    setSelectedFileId(null);
    refreshFileList();  // Call the refresh function passed as a prop
  };

  // Function to handle the success of enrichment and refresh the list
  const handleEnrichmentSuccess = () => {
    closeEnrichmentModal();  // This will close the modal and refresh the list
  };

  // Define columns for the DataGrid
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
          {/* Button to view the content of the selected file */}
          <Button 
            onClick={() => handleFileClick(params.id)}
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
            onClick={() => openEnrichmentModal(params.id)}
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

  // Create rows for the DataGrid from csvFiles prop
  const fileRows = csvFiles.map((file) => ({
    id: file.id,
    file_name: file.file_name,
    created_at: file.created_at,
  }));

  return (
    <>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={fileRows}
          columns={fileColumns}
          onRowClick={(params) => {
            handleFileClick(params.id);
          }}
        />
      </div>

      {/* Modal for File Enrichment */}
      <Modal
        open={isEnrichmentModalOpen}
        onClose={closeEnrichmentModal}  // Close modal on click outside or pressing escape
        aria-labelledby="file-enrichment-modal"
        aria-describedby="file-enrichment-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',  // Set the width of the modal
            maxHeight: '90vh',  // Ensure modal fits in viewport
            overflowY: 'auto',  // Enable scrolling if content overflows
            bgcolor: 'background.paper',
            borderRadius: '10px',
            boxShadow: 24,
            p: 4,
          }}
        >
          {/* Render FileEnrichment component within the modal if a file is selected */}
          {selectedFileId && (
            <FileEnrichment 
              fileId={selectedFileId} 
              onClose={handleEnrichmentSuccess}  // Call this when enrichment is successful
            />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default FileList;
