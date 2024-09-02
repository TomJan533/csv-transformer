import React, { useState } from 'react';
import './App.css';
import HealthCheck from './HealthCheck.js';
import CSVUpload from './CSVUpload.js';
import CSVList from './CSVList.js';
import FileEnrichment from './FileEnrichment.js';

function App() {
  const [selectedFileContent, setSelectedFileContent] = useState(null);
  const [selectedFileId, setSelectedFileId] = useState(null);

  const handleFileSelect = (fileContent, fileId) => {
    console.log('Selected File ID:', fileId); // Debugging
    setSelectedFileContent(fileContent);
    setSelectedFileId(fileId);
  };

  return (
    <div className="App">
      <div>
        <HealthCheck />
      </div>
      <div>
        <CSVUpload />
      </div>
      <div>
        <CSVList onFileSelect={handleFileSelect} />
      </div>
      {selectedFileContent && (
        <div>
          <FileEnrichment
            selectedFileContent={selectedFileContent}
            fileId={selectedFileId}
          />
        </div>
      )}
    </div>
  );
}

export default App;
