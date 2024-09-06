import React, { useState } from 'react';
import './Home.css';
import CSVUpload from '../../components/CSVUpload/CSVUpload.js';
// import CSVList from './CSVList.js';
// import FileEnrichment from './FileEnrichment.js';

function Home() {
//   const [selectedFileContent, setSelectedFileContent] = useState(null);
//   const [selectedFileId, setSelectedFileId] = useState(null);

//   const handleFileSelect = (fileContent, fileId) => {
//     console.log('Selected File ID:', fileId); // Debugging
//     setSelectedFileContent(fileContent);
//     setSelectedFileId(fileId);
//   };

  return (
    <div className="Home">
      <div>
        <CSVUpload />
      </div>
      {/* <div>
        <CSVList onFileSelect={handleFileSelect} />
      </div>
      {selectedFileContent && (
        <div>
          <FileEnrichment
            selectedFileContent={selectedFileContent}
            fileId={selectedFileId}
          />
        </div>
      )} */}
    </div>
  );
}

export default Home;