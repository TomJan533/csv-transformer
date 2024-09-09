import React, { Component } from 'react';
import CSVList from '../../components/CSVList/CSVList.js';
import FileContent from '../../components/CSVList/FileContent.js';
import DashboardLayout from '../../DashboardLayout.js';
import CSVUpload from '../../components/CSVUpload/CSVUpload.js'; // Import CSVUpload component

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFileId: null,
      selectedFileContent: [],
      totalRows: 0,
      listUpdateTrigger: false,
      isFileListEmpty: false,  // Track if file list is empty
    };
  }

  // Lifecycle method: called once when the component mounts
  componentDidMount() {
    this.checkIfFileListIsEmpty(); // Initial check for file list emptiness
  }

  // Lifecycle method: called whenever the component updates
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.selectedFileId !== this.state.selectedFileId ||
      prevState.selectedFileContent !== this.state.selectedFileContent ||
      prevState.totalRows !== this.state.totalRows
    ) {
      this.refreshFileList();
    }
  }

  // Check if the file list is empty
  checkIfFileListIsEmpty = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/csv-files/`);
      const data = await response.json();
      if (data.length === 0) {
        this.setState({ isFileListEmpty: true });
      } else {
        this.setState({ isFileListEmpty: false });
      }
    } catch (error) {
      console.error("Error fetching file list:", error);
    }
  };

  // Handler for selecting a file
  handleFileSelect = (fileId, fileContent, totalRowsFromCSVList) => {
    this.setState({
      selectedFileId: fileId,
      selectedFileContent: fileContent,
      totalRows: totalRowsFromCSVList,
    });
  };

  // Refresh the CSV list and recheck if it's empty
  refreshFileList = async () => {
    // Toggle the list update trigger to force re-fetch
    this.setState((prevState) => ({
      listUpdateTrigger: !prevState.listUpdateTrigger,
    }));

    // After refresh, check if the file list is still empty
    await this.checkIfFileListIsEmpty(); // Ensure the state is updated after the first file is added
  };

  render() {
    const { selectedFileId, selectedFileContent, totalRows, listUpdateTrigger, isFileListEmpty } = this.state;

    return (
      <DashboardLayout onUploadSuccess={this.refreshFileList}> {/* Pass refreshFileList to DashboardLayout */}
        <div className="Home">
          {isFileListEmpty ? (
            <div>
              <CSVUpload onUploadSuccess={this.refreshFileList} /> {/* Render CSVUpload when file list is empty */}
            </div>
          ) : (
            <div>
              <CSVList
                onFileSelect={this.handleFileSelect}
                updateTrigger={listUpdateTrigger}
                refreshFileList={this.refreshFileList}
              />
            </div>
          )}

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
}

export default Home;
