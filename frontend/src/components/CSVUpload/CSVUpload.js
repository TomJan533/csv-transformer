import React, { Component } from 'react';
import { styled } from '@mui/material/styles/index.js'; // Keep the .js for @mui/material
import Button from '@mui/material/Button/index.js'; // Keep the .js for @mui/material

// Hidden input style
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
    const selectedFile = event.target.files[0];

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
      <Button
        component="label"
        variant="contained"
      >
        Upload CSV files
        <VisuallyHiddenInput
          type="file"
          onChange={this.handleFileChange}
        />
      </Button>
    );
  }
}

export default CSVUpload;
