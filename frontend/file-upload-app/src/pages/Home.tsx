import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Login from '../components/Login';
import Register from '../components/Register';
import Dashboard from '../components/Dashboard';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth(); // FIX 1: Remove unused 'user' variable
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);

  const handleSwitchToRegister = () => {
    setIsLoginMode(false);
  };

  const handleSwitchToLogin = () => {
    setIsLoginMode(true);
  };

  // If user is authenticated, show dashboard
  if (isAuthenticated) {
    return <Dashboard />;
  }

  // If not authenticated, show login/register forms
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #e1e5e9'
      }}>
        {/* Header with toggle buttons */}
        <div style={{
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #dee2e6',
          padding: '0'
        }}>
          <div style={{ display: 'flex' }}>
            <button
              onClick={handleSwitchToLogin}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                backgroundColor: isLoginMode ? '#007bff' : 'transparent',
                color: isLoginMode ? 'white' : '#6c757d',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              Login
            </button>
            <button
              onClick={handleSwitchToRegister}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                backgroundColor: !isLoginMode ? '#007bff' : 'transparent',
                color: !isLoginMode ? 'white' : '#6c757d',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              Register
            </button>
          </div>
        </div>

        {/* Form content */}
        <div style={{ padding: '0' }}>
          {isLoginMode ? (
            <Login /> // FIX 2: Remove onSwitchToRegister prop if Login component doesn't expect it
          ) : (
            <Register /> // FIX 3: Remove onSwitchToLogin prop if Register component doesn't expect it
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;