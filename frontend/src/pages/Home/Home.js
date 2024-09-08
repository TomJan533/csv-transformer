import React, { useState } from 'react';
// import CSVUpload from '../../components/CSVUpload/CSVUpload.js';
import CSVList from '../../components/CSVList/CSVList.js';
import FileContent from '../../components/CSVList/FileContent.js';
import DashboardLayout from '../../DashboardLayout.js';

function Home() {
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [selectedFileContent, setSelectedFileContent] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [listUpdateTrigger, setListUpdateTrigger] = useState(false);

  const handleFileSelect = (fileId, fileContent, totalRowsFromCSVList) => {
    setSelectedFileId(fileId);
    setSelectedFileContent(fileContent);
    setTotalRows(totalRowsFromCSVList);
  };

  // const handleUploadSuccess = () => {
  //   setListUpdateTrigger((prev) => !prev); // Toggle to trigger CSV list update
  // };

  const refreshFileList = () => {
    setListUpdateTrigger((prev) => !prev); // Refresh CSV List when called
  };

  return (
    <DashboardLayout>
      <div className="Home">
        {/* <div>
          <CSVUpload onUploadSuccess={handleUploadSuccess} />
        </div> */}
        <div>
          <CSVList onFileSelect={handleFileSelect} updateTrigger={listUpdateTrigger} refreshFileList={refreshFileList} />
        </div>
        <div>
          {selectedFileId && selectedFileContent.length > 0 && (
            <FileContent 
              fetchPaginatedData={(page, pageSize) =>
                fetch(`${process.env.REACT_APP_API_URL}/csv-files/${selectedFileId}/?page=${page}&page_size=${pageSize}`)
                  .then((response) => response.json())
              }
              totalRows={totalRows}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Home;
