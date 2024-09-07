import React, { useState } from 'react';
import './Home.css';
import CSVUpload from '../../components/CSVUpload/CSVUpload.js';
import CSVList from '../../components/CSVList/CSVList.js';
import FileContent from '../../components/CSVList/FileContent.js';

function Home() {
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [selectedFileContent, setSelectedFileContent] = useState([]);
  const [ setTotalRows] = useState(0);

  const handleFileSelect = (fileId, fileContent, totalRowsFromCSVList) => {
    setSelectedFileId(fileId);
    setSelectedFileContent(fileContent);
    setTotalRows(totalRowsFromCSVList);
  };

  // Define fetchPaginatedData function
  const fetchPaginatedData = (page, pageSize) => {
    return fetch(`${process.env.REACT_APP_API_URL}/csv-files/${selectedFileId}/?page=${page}&page_size=${pageSize}`)
      .then(response => response.json())
      .then(data => {
        return {
          results: data.results, // Current page data
          count: data.count,     // Total rows
        };
      });
  };

  return (
    <div className="Home">
      <div>
        <CSVUpload />
      </div>
      <div>
        <CSVList onFileSelect={handleFileSelect} />
      </div>
      <div>
        {selectedFileId && selectedFileContent.length > 0 && (
          <FileContent 
            fetchPaginatedData={fetchPaginatedData}
          />
        )}
      </div>
    </div>
  );
}

export default Home;
