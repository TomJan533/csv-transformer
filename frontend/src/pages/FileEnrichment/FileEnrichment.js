import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';

const apiUrl = process.env.REACT_APP_API_URL;

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (error) {
    return false;
  }
};

function FileEnrichment({ fileId, onClose }) {
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [secondDropdownOptions, setSecondDropdownOptions] = useState([]);
  const [secondDropdownValue, setSecondDropdownValue] = useState('');
  const [responsePreview, setResponsePreview] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  useEffect(() => {
    setIsSubmitDisabled(!(selectedColumn && secondDropdownValue));
  }, [selectedColumn, secondDropdownValue]);

  useEffect(() => {
    if (fileId) {
      fetch(`${apiUrl}/csv-files/${fileId}/?_page=1&_limit=1`)
        .then(response => response.json())
        .then(data => {
          if (data.results && Array.isArray(data.results) && data.results.length > 0) {
            const cols = Object.keys(data.results[0]);
            setColumns(cols);
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
    setSuccessMessage('');
    handleSubmit(selectedUrl);
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
        onClose();  // This triggers the close and refresh process
      })
      .catch(err => {
        setError(`Error submitting data: ${err.message}`);
        setSuccessMessage('');
      });
  };

  return (
    <div>
      {/* UI for selecting data and previewing */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="input">Select Data Source URL:</label>
        <select
          id="input"
          value={inputValue}
          onChange={handleInputChange}
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

      {/* Response Preview */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        <h3>Response Preview</h3>
        {responsePreview ? (
          <pre style={{ maxHeight: '300px', overflowY: 'auto' }}>{responsePreview}</pre>
        ) : (
          <p>No response to display</p>
        )}
      </div>

      {/* Column and Second Dropdown */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
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

      {/* Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePostSubmit}
          style={{ width: '45%' }}
          disabled={isSubmitDisabled} // Disable submit button if inputs are invalid
        >
          Submit Choices
        </Button>
        
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClose}
          style={{ width: '45%' }}
        >
          Exit Without Changes
        </Button>
      </div>

      {/* Error and Success Messages */}
      {error && <div style={{ color: 'red', marginTop: '20px' }}>{error}</div>}
      {successMessage && <div style={{ color: 'green', marginTop: '20px' }}>{successMessage}</div>}
    </div>
  );
}

export default FileEnrichment;
