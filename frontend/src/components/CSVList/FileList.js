import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Modal, Box } from '@mui/material';
import FileEnrichment from '../../pages/FileEnrichment/FileEnrichment.js';

const FileList = ({ csvFiles, handleFileClick, refreshFileList }) => {
  const [isEnrichmentModalOpen, setIsEnrichmentModalOpen] = useState(false); // State to manage modal open/close
  const [selectedFileId, setSelectedFileId] = useState(null); // Track selected file for enrichment

  const openEnrichmentModal = (fileId) => {
    setSelectedFileId(fileId);
    setIsEnrichmentModalOpen(true);
  };

  const closeEnrichmentModal = () => {
    setIsEnrichmentModalOpen(false);
    setSelectedFileId(null);
    refreshFileList();
  };

  const handleEnrichmentSuccess = () => {
    // Refresh the file list after enrichment and close modal
    refreshFileList();
    closeEnrichmentModal();
  };

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
          
          {/* Button to trigger Data Enrichment Modal */}
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
  onClose={closeEnrichmentModal}
  aria-labelledby="file-enrichment-modal"
  aria-describedby="file-enrichment-modal-description"
>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',  // Make the modal box larger
      maxHeight: '90vh',  // Ensure the modal content fits within the viewport
      overflowY: 'auto',  // Add scrolling in case the content overflows
      bgcolor: 'background.paper',
      borderRadius: '10px',
      boxShadow: 24,
      p: 4,
    }}
  >
    {selectedFileId && (
      <FileEnrichment 
        fileId={selectedFileId}
        onClose={handleEnrichmentSuccess} 
        refreshFileList={refreshFileList}  
      />
    )}
  </Box>
      </Modal>


    </>
  );
};

export default FileList;
