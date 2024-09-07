import React, { useState } from 'react';
import './Home.css';
import CSVUpload from '../../components/CSVUpload/CSVUpload.js';
import CSVList from '../../components/CSVList/CSVList.js';
import FileEnrichment from './../../FileEnrichment.js';

function Home() {
  const [selectedFileContent, setSelectedFileContent] = useState(null);
  const [selectedFileId, setSelectedFileId] = useState(null);

  const handleFileSelect = (fileContent, fileId) => {
    setSelectedFileContent(fileContent);
    setSelectedFileId(fileId);
  };

  return (
    <div className="Home">
      <section className="upload-section">
        <CSVUpload />
      </section>

      <section className="list-section">
        <CSVList onFileSelect={handleFileSelect} />
      </section>

      {selectedFileContent && (
        <section className="enrichment-section">
          <h2>File Enrichment</h2>
          <FileEnrichment
            selectedFileContent={selectedFileContent}
            fileId={selectedFileId}
          />
        </section>
      )}
    </div>
  );
}

export default Home;
