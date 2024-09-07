import React, { useState } from 'react';

const apiUrl = process.env.REACT_APP_API_URL;

const CSVUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

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
            <form onSubmit={handleSubmit}>
                <input type="file" accept=".csv" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CSVUpload;
