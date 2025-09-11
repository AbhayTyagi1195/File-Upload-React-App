import React, { useState, useEffect } from 'react';
import { filesAPI } from '../services/api';
import type { FileItem } from '../types';

interface FileListProps {
  refreshTrigger: number;
}

const FileList: React.FC<FileListProps> = ({ refreshTrigger }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState<string>('');

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const filesData = await filesAPI.getAll();
      setFiles(filesData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await filesAPI.delete(id);
        setFiles(files.filter(file => file._id !== id));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete file');
      }
    }
  };

  const handleEditClick = (file: FileItem) => {
    setEditingFile(file._id);
    setNewFileName(file.originalName);
  };

  const handleUpdateFileName = async (id: string) => {
    if (!newFileName.trim()) {
      setError('Filename cannot be empty');
      return;
    }

    try {
      const updatedFile = await filesAPI.update(id, { originalName: newFileName.trim() });
      setFiles(files.map(file => 
        file._id === id ? updatedFile : file
      ));
      setEditingFile(null);
      setNewFileName('');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update filename');
    }
  };

  const handleCancelEdit = () => {
    setEditingFile(null);
    setNewFileName('');
    setError('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return <div>Loading files...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Your Files ({files.length})</h3>
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {files.map((file) => (
            <div
              key={file._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '15px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  {editingFile === file._id ? (
                    <div style={{ marginBottom: '10px' }}>
                      <input
                        type="text"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px',
                          marginBottom: '10px'
                        }}
                        placeholder="Enter new filename"
                      />
                      <div>
                        <button
                          onClick={() => handleUpdateFileName(file._id)}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            marginRight: '5px'
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <h4 style={{ margin: '0 0 5px 0' }}>{file.originalName}</h4>
                  )}
                  <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                    Type: {file.mimetype} | Size: {formatFileSize(file.size)}
                  </p>
                  <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#999' }}>
                    Uploaded: {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  <a
                    href={`http://localhost:5000/uploads/${file.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  >
                    Download
                  </a>
                  {editingFile !== file._id && (
                    <button
                      onClick={() => handleEditClick(file)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#ffc107',
                        color: 'black',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      Rename
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(file._id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileList;