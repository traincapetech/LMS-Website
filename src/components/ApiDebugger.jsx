import React, { useState } from 'react';
import { authAPI, coursesAPI, couponsAPI } from '../utils/api';

const ApiDebugger = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test, status, data, error = null) => {
    setResults(prev => [...prev, {
      test,
      status,
      data,
      error,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runTests = async () => {
    setLoading(true);
    setResults([]);

    try {
      // Test 1: Basic courses API
      try {
        const response = await coursesAPI.getAllCourses();
        addResult('Get Courses', '✅ Success', response.data);
      } catch (error) {
        addResult('Get Courses', '❌ Failed', null, error.message);
      }

      // Test 2: Login API
      try {
        const response = await authAPI.login({
          email: 'test@test.com',
          password: 'test123'
        });
        addResult('Login Test', '✅ Success', { token: response.data.token ? 'Present' : 'Missing' });
      } catch (error) {
        addResult('Login Test', '❌ Failed', null, error.response?.data?.message || error.message);
      }

      // Test 3: Coupons API (requires auth)
      try {
        const response = await couponsAPI.getCoupons();
        addResult('Get Coupons', '✅ Success', response.data);
      } catch (error) {
        addResult('Get Coupons', '❌ Failed', null, error.response?.data?.message || error.message);
      }

      // Test 4: Check localStorage
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      addResult('LocalStorage', token ? '✅ Token Found' : '❌ No Token', {
        token: token ? 'Present' : 'Missing',
        user: user ? 'Present' : 'Missing'
      });

    } catch (error) {
      addResult('Test Suite', '❌ Failed', null, error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f8f9fa', 
      borderRadius: '8px',
      margin: '20px',
      fontFamily: 'monospace'
    }}>
      <h3 style={{ marginBottom: '20px', color: '#333' }}>🔧 API Debugger</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runTests}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {loading ? 'Running Tests...' : 'Run API Tests'}
        </button>
        
        <button 
          onClick={clearResults}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear Results
        </button>
      </div>

      {results.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ marginBottom: '10px', color: '#333' }}>Test Results:</h4>
          {results.map((result, index) => (
            <div 
              key={index}
              style={{
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: 'white',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            >
              <div style={{ 
                fontWeight: 'bold', 
                color: result.status.includes('✅') ? '#28a745' : '#dc3545',
                marginBottom: '5px'
              }}>
                {result.test} - {result.status}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                {result.timestamp}
              </div>
              {result.data && (
                <div style={{ fontSize: '12px', color: '#333' }}>
                  <strong>Data:</strong> {JSON.stringify(result.data, null, 2)}
                </div>
              )}
              {result.error && (
                <div style={{ fontSize: '12px', color: '#dc3545' }}>
                  <strong>Error:</strong> {result.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiDebugger; 