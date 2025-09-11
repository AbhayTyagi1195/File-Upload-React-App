import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FileUpload from './FileUpload';
import FileList from './FileList';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleUploadSuccess = () => {
    // Trigger file list refresh
    setRefreshTrigger(prev => prev + 1);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h1 style={{ margin: '0 0 5px 0', color: '#333' }}>
            Welcome, {user?.username}!
          </h1>
          <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
            Email: {user?.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Logout
        </button>
      </div>

      {/* File Upload Section */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <FileUpload onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* File List Section */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '20px'
      }}>
        <FileList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default Dashboard;