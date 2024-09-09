import React, { Component } from 'react';
import { styled } from '@mui/material/styles/index.js'; 
import Button from '@mui/material/Button/index.js';
import Box from '@mui/material/Box/index.js';
import Typography from '@mui/material/Typography/index.js';


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

class CSVUpload extends Component {
  constructor(props) {
    super(props);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  // Handle file change and upload logic
  async handleFileChange(event) {
    const selectedFile = event.target.files[0]; // Get the first file (only 1 allowed)

    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/upload-csv/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('File uploaded successfully!');
        if (this.props.onUploadSuccess) {
          this.props.onUploadSuccess(); // Trigger parent callback to refresh file list
        }
      } else {
        const result = await response.json();
        console.error('Upload failed:', result.error);
      }
    } catch (error) {
      console.error('Error occurred during file upload:', error);
    }
  }

 

render() {
  return (
    <Box
      sx={{
        height: '40vh',
        display: 'flex',
        flexDirection: 'column', // Stack text and button vertically
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        boxShadow: 'inset 3px 3px 3px rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center', // Center the text
      }}
    >
      {/* Enhanced Greeting Text */}
      <Typography variant="h5" gutterBottom>
        Welcome to the CSV Transformer Tool
      </Typography>
      <Typography variant="body1" gutterBottom>
        Get started by uploading your impressions data to transform it effortlessly.
      </Typography>
      
      {/* Upload Button */}
      <Button
        component="label"
        variant="contained"
        sx={{ marginTop: '20px' }} // Add some margin to separate button from text
      >
        Upload File
        <VisuallyHiddenInput
          type="file"
          onChange={this.handleFileChange}
          accept=".csv"
        />
      </Button>
    </Box>
  );
}

}

export default CSVUpload;
