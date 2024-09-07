import React, { useState } from 'react';
import CSVUpload from '../../components/CSVUpload/CSVUpload.js';
import CSVList from '../../components/CSVList/CSVList.js';
import FileContent from '../../components/CSVList/FileContent.js';

function Home() {
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [selectedFileContent, setSelectedFileContent] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [listUpdateTrigger, setListUpdateTrigger] = useState(false); // State to trigger updates

  const handleFileSelect = (fileId, fileContent, totalRowsFromCSVList) => {
    setSelectedFileId(fileId);
    setSelectedFileContent(fileContent);
    setTotalRows(totalRowsFromCSVList);
  };

  const handleUploadSuccess = () => {
    setListUpdateTrigger((prev) => !prev); // Toggle to trigger CSV list update
  };

  const fetchPaginatedData = (page, pageSize) => {
    return fetch(`${process.env.REACT_APP_API_URL}/csv-files/${selectedFileId}/?page=${page}&page_size=${pageSize}`)
      .then(response => response.json())
      .then(data => {
        return {
          results: data.results,
          count: data.count,
        };
      });
  };

  return (
    <div className="Home">
      <div>
        <CSVUpload onUploadSuccess={handleUploadSuccess} /> {/* Pass the callback to CSVUpload */}
      </div>
      <div>
        <CSVList onFileSelect={handleFileSelect} updateTrigger={listUpdateTrigger} /> {/* Pass updateTrigger */}
      </div>
      <div>
        {selectedFileId && selectedFileContent.length > 0 && (
          <FileContent 
            fetchPaginatedData={fetchPaginatedData}
            totalRows={totalRows}
          />
        )}
      </div>
    </div>
  );
}

export default Home;
