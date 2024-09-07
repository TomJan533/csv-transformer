import React, { useState } from 'react';
import './Home.css';
import CSVUpload from '../../components/CSVUpload/CSVUpload.js';
import CSVList from '../../components/CSVList/CSVList.js';

function Home() {
  const [ setSelectedFileContent] = useState(null);
  const [ setSelectedFileId] = useState(null);

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
    </div>
  );
}

export default Home;
