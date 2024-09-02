import React, { useState, useEffect } from 'react';

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const validateResponse = (response) => {
  if (!Array.isArray(response)) {
    return 'Response must be a list';
  }
  if (response.length !== 1) {
    return 'List must contain exactly one item';
  }
  if (typeof response[0] !== 'object' || response[0] === null) {
    return 'Item must be an object';
  }
  return ''; // Return empty string if validation passes
};

const apiUrl = process.env.REACT_APP_API_URL;

function FileEnrichment({ selectedFileContent, fileId }) {
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [secondDropdownOptions, setSecondDropdownOptions] = useState([]);
  const [secondDropdownValue, setSecondDropdownValue] = useState('');
  const [responsePreview, setResponsePreview] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message

  useEffect(() => {
    if (selectedFileContent && selectedFileContent.length > 0) {
      const cols = Object.keys(selectedFileContent[0]);
      setColumns(cols);
    }
  }, [selectedFileContent, fileId]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setResponsePreview('');
    setError('');
    setSuccessMessage(''); // Clear success message on input change
  };

  const handleSubmit = () => {
    if (isValidUrl(inputValue)) {
      const urlWithParams = `${inputValue}?_page=1&_limit=1`;

      fetch(urlWithParams)
        .then(response => response.json())
        .then(data => {
          const validationError = validateResponse(data);
          if (validationError) {
            setError(validationError);
            setResponsePreview('');
            setSuccessMessage('');
          } else {
            // No validation errors
            const item = data[0];
            setSecondDropdownOptions(Object.keys(item));
            setResponsePreview(JSON.stringify(item, null, 2));
            setError('');
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
  
    // Check each field individually
    if (!fileId) missingFields.push('File ID');
    if (!selectedColumn) missingFields.push('Selected Column');
    if (!inputValue) missingFields.push('Input URL');
    if (!secondDropdownValue) missingFields.push('Second Dropdown Value');
  
    // If there are missing fields, show an error message
    if (missingFields.length > 0) {
      setError(`Please fill in the following fields: ${missingFields.join(', ')}`);
      return;
    }
  
    const postData = {
      fileId,
      selectedColumn,
      url: inputValue,
      secondDropdownValue
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
        // Handle successful response
        console.log('Submission successful:', data);
        setSuccessMessage(`Submission successful: ${JSON.stringify(data, null, 2)}`); // Update success message
        setError(''); // Clear any previous errors
      })
      .catch(err => {
        setError(`Error submitting data: ${err.message}`);
        setSuccessMessage(''); // Clear success message if there's an error
      });
  };

  return (
    <div>
      <h2>File Enrichment</h2>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
        <div>
          <label htmlFor="columns">Select a Column:</label>
          <select
            id="columns"
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
          >
            <option value="">-- Select a column --</option>
            {columns.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="input">Input URL:</label>
          <input
            id="input"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
          />
          <button onClick={handleSubmit}>Fetch Data</button>
        </div>
        <div>
          <label htmlFor="secondDropdown">Second Dropdown:</label>
          <select
            id="secondDropdown"
            value={secondDropdownValue}
            onChange={(e) => setSecondDropdownValue(e.target.value)}
          >
            <option value="">-- Select an option --</option>
            {secondDropdownOptions.map((opt, index) => (
              <option key={index} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <button onClick={handlePostSubmit}>Submit Choices</button>
        </div>
      </div>
      {responsePreview && (
        <div>
          <h3>Response Preview:</h3>
          <pre>{responsePreview}</pre>
        </div>
      )}
      {error && (
        <div style={{ color: 'red' }}>
          <p>{error}</p>
        </div>
      )}
      {successMessage && (
        <div style={{ color: 'green' }}>
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
}

export default FileEnrichment;
