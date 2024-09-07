import React, { useState, useEffect } from 'react';
import { useFetchCSVFiles } from '../../hooks/useFetchCSVFilesHook.js';
import FileList from './FileList.js';
import FileContent from './FileContent.js';
import Loading from './Loading.js';
import Error from './Error.js';

const CSVList = ({ onFileSelect }) => {
  const { csvFiles, loading, error } = useFetchCSVFiles();
  const [selectedFileContent, setSelectedFileContent] = useState(null);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [selectionModel, setSelectionModel] = useState([]); // Tracks selected row in DataGrid

  // Function to handle file selection and fetching content
  const handleFileClick = (fileId) => {
    setSelectedFileId(fileId);
    setSelectionModel([fileId]); // Update the selection model for DataGrid
    fetch(`${process.env.REACT_APP_API_URL}/csv-files/${fileId}/`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch file content');
        }
        return response.json();
      })
      .then(data => {
        setSelectedFileContent(data);
        onFileSelect(data, fileId); // Notify parent component with both content and fileId
      })
      .catch(error => {
        console.error('Error fetching file content:', error);
      });
  };

  // Automatically select and "click" the first row if the file list is loaded
  useEffect(() => {
    if (csvFiles.length > 0 && !selectedFileId) {
      const firstFileId = csvFiles[0].id;
      handleFileClick(firstFileId); // Automatically "click" the first file
    }
  });

  if (loading && selectedFileId === null) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div>
      {/* File List */}
      <FileList 
        csvFiles={csvFiles} 
        handleFileClick={handleFileClick} 
        selectionModel={selectionModel} // Pass selection model to FileList
        setSelectionModel={setSelectionModel} // Allow updating from FileList
      />

      {/* Selected File Content */}
      {selectedFileContent && (
        <FileContent
          selectedFileContent={selectedFileContent}
          fileName={csvFiles.find(file => file.id === selectedFileId)?.file_name}
        />
      )}
    </div>
  );
};

export default CSVList;
