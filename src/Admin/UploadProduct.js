// UploadProduct.js
import React, { useState } from 'react';
import axios from 'axios';

const ExcelUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);

    axios.post('http://localhost:8080/api/products/upload', formData)
      .then(() => {
        alert('Products uploaded successfully');
        onUpload(); // Notify parent to refresh products
        setFile(null); // Reset file input
      })
      .catch((error) => {
        console.error('Error uploading Excel:', error);
        alert('Failed to upload products. Please try again.'); // Provide feedback to user
      });
  };

  return (
    <div>
      <h2>Upload Products via Excel</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>Upload</button>
    </div>
  );
};

export default ExcelUpload;
