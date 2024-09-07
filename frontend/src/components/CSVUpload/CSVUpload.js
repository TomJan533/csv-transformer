import React, { useState } from 'react';

const apiUrl = process.env.REACT_APP_API_URL;

const CSVUpload = () => {
    const [message, setMessage] = useState('');

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) {
            return; // If no file is selected, return early
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch(`${apiUrl}/upload-csv/`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                setMessage('File uploaded successfully!');
            } else {
                setMessage(`Upload failed: ${result.error}`);
            }
        } catch (error) {
            setMessage('An error occurred during upload.');
        }
    };

    return (
        <div>
            <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileChange}
            />
            {message && <p>{message}</p>}
        </div>
    );
};

export default CSVUpload;
