import React, { useState } from 'react';
import { filesAPI } from '../services/api';

interface FileUploadProps {
  onUploadSuccess: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      await filesAPI.upload(selectedFile);
      setSelectedFile(null);
      onUploadSuccess();
      // Reset file input
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '4px' }}>
      <h3>Upload File</h3>
      <div style={{ marginBottom: '15px' }}>
        <input
          id="fileInput"
          type="file"
          onChange={handleFileSelect}
          style={{ marginBottom: '10px' }}
        />
        {selectedFile && (
          <div style={{ fontSize: '14px', color: '#666' }}>
            Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
          </div>
        )}
      </div>
      {error && (
        <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>
      )}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          opacity: !selectedFile || uploading ? 0.6 : 1,
        }}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default FileUpload;