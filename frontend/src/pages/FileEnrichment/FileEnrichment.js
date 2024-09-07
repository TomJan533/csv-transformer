import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_URL;

// Define the isValidUrl function here
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (error) {
    return false;
  }
};

function FileEnrichment() {
  const { fileId } = useParams(); // Get the fileId from the URL
  const [columns, setColumns] = useState([]); // State to hold extracted columns
  const [selectedColumn, setSelectedColumn] = useState('');
  const [inputValue, setInputValue] = useState(''); // This will store the selected URL
  const [secondDropdownOptions, setSecondDropdownOptions] = useState([]);
  const [secondDropdownValue, setSecondDropdownValue] = useState('');
  const [responsePreview, setResponsePreview] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  useEffect(() => {
    if (fileId) {
      fetch(`${apiUrl}/csv-files/${fileId}/`) // Fetch all data from the CSV
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            const cols = Object.keys(data[0]); // Extract columns from the first row
            setColumns(cols); // Set the extracted columns
          } else {
            setError('Error: No data found for the file.');
          }
        })
        .catch(err => {
          setError(`Error fetching file content: ${err.message}`);
        });
    }
  }, [fileId]);

  const handleInputChange = (e) => {
    const selectedUrl = e.target.value;
    setInputValue(selectedUrl);
    setResponsePreview('');
    setError('');
    setSuccessMessage(''); // Clear success message on input change
    handleSubmit(selectedUrl); // Automatically run fetch logic when a URL is selected
  };

  const handleSubmit = (selectedUrl = inputValue) => {
    if (isValidUrl(selectedUrl)) {
      const urlWithParams = `${selectedUrl}?_page=1&_limit=1`;

      fetch(urlWithParams)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data) && data.length === 1) {
            const item = data[0];
            setSecondDropdownOptions(Object.keys(item));
            setResponsePreview(JSON.stringify(item, null, 2));
            setError('');
          } else {
            setError('Invalid response from the provided URL.');
          }
        })
        .catch(err => {
          setError(`Error fetching data: ${err.message}`);
          setResponsePreview('');
          setSuccessMessage('');
        });
    } else {
      setError('Invalid URL');
      setResponsePreview('');
      setSuccessMessage('');
    }
  };

  const handlePostSubmit = () => {
    let missingFields = [];

    if (!fileId) missingFields.push('File ID');
    if (!selectedColumn) missingFields.push('Selected Column');
    if (!inputValue) missingFields.push('Input URL');
    if (!secondDropdownValue) missingFields.push('Second Dropdown Value');

    if (missingFields.length > 0) {
      setError(`Please fill in the following fields: ${missingFields.join(', ')}`);
      return;
    }

    const postData = {
      fileId,
      selectedColumn,
      url: inputValue,
      secondDropdownValue,
    };

    fetch(`${apiUrl}/csv-enrichment/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
      .then(response => response.json())
      .then(data => {
        setSuccessMessage(`Submission successful: ${JSON.stringify(data, null, 2)}`);
        setError('');
      })
      .catch(err => {
        setError(`Error submitting data: ${err.message}`);
        setSuccessMessage('');
      });
  };

  return (
    <div>
      <h2>File Enrichment for File ID: {fileId}</h2>
      
      {/* 1st Row - Endpoint Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="input">Select Data Source URL:</label>
        <select
          id="input"
          value={inputValue}
          onChange={handleInputChange} // Trigger handleSubmit when URL is selected
          style={{ width: '100%', padding: '10px' }}
        >
          <option value="">-- Select a URL --</option>
          <option value="https://jsonplaceholder.typicode.com/posts">
            https://jsonplaceholder.typicode.com/posts
          </option>
          <option value="https://jsonplaceholder.typicode.com/users">
            https://jsonplaceholder.typicode.com/users
          </option>
        </select>
      </div>
  
      {/* 2nd Row - Response Preview */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        <h3>Response Preview</h3>
        {responsePreview ? (
          <pre style={{ maxHeight: '300px', overflowY: 'auto' }}>{responsePreview}</pre>
        ) : (
          <p>No response to display</p>
        )}
      </div>
  
      {/* 3rd Row - Columns Dropdown and Second Dropdown */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        {/* Columns Dropdown */}
        <div style={{ flex: 1 }}>
          <label htmlFor="columns">Select a Column:</label>
          <select
            id="columns"
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
            style={{ width: '100%', padding: '10px' }}
          >
            <option value="">-- Select a column --</option>
            {columns.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
  
        {/* Second Dropdown */}
        <div style={{ flex: 1 }}>
          <label htmlFor="secondDropdown">Second Dropdown:</label>
          <select
            id="secondDropdown"
            value={secondDropdownValue}
            onChange={(e) => setSecondDropdownValue(e.target.value)}
            style={{ width: '100%', padding: '10px' }}
          >
            <option value="">-- Select an option --</option>
            {secondDropdownOptions.map((opt, index) => (
              <option key={index} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
  
      {/* 4th Row - Submit Button */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handlePostSubmit} 
          style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', width: '100%' }}
        >
          Submit Choices
        </button>
      </div>
  
      {/* Error and Success Messages */}
      {error && (
        <div style={{ color: 'red', marginTop: '20px' }}>
          <p>{error}</p>
        </div>
      )}
      {successMessage && (
        <div style={{ color: 'green', marginTop: '20px' }}>
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
  
  
  
}

export default FileEnrichment;
