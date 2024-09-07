import React, { useState } from 'react';
import { useFetchCSVFiles } from '../../hooks/useFetchCSVFilesHook.js';
import FileList from './FileList.js';
import FileContent from './FileContent.js';
import Loading from './Loading.js';
import Error from './Error.js';

const CSVList = ({ onFileSelect }) => {
  const { csvFiles, loading, error } = useFetchCSVFiles();
  const [selectedFileContent, setSelectedFileContent] = useState(null);
  const [selectedFileId, setSelectedFileId] = useState(null);

  const handleFileClick = (fileId) => {
    setSelectedFileId(fileId);
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

  if (loading && selectedFileId === null) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div>
      <FileList csvFiles={csvFiles} handleFileClick={handleFileClick} />

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
