import React from 'react';
import PropTypes from 'prop-types';

const FileUpload = ({ fileInputRef, onUploadSuccess }) => {
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return; // No file selected
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/upload-csv/`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log('File uploaded successfully!');
        if (onUploadSuccess) {
          onUploadSuccess(); // Refresh the CSV list
        }
      } else {
        console.error('Upload failed:', result.error);
      }
    } catch (error) {
      console.error('Error during file upload:', error);
    }
  };

  return (
    <input
      type="file"
      accept=".csv"
      ref={fileInputRef}
      style={{ display: 'none' }}
      onChange={handleFileChange}
    />
  );
};

FileUpload.propTypes = {
  fileInputRef: PropTypes.object.isRequired,
  onUploadSuccess: PropTypes.func.isRequired,
};

export default FileUpload;
