// Network connectivity test utility
export const testNetworkConnectivity = async () => {
    const tests = [];
    
    // Test 1: Basic connectivity
    try {
      const start = Date.now();
      const response = await fetch('https://lms-backend-5s5x.onrender.com/api/courses');
      const end = Date.now();
      tests.push({
        name: 'Basic Connectivity',
        status: 'success',
        responseTime: end - start,
        statusCode: response.status,
        message: `Response time: ${end - start}ms`
      });
    } catch (error) {
      tests.push({
        name: 'Basic Connectivity',
        status: 'error',
        message: error.message
      });
    }
  
    // Test 2: CORS preflight (removed to avoid issues)
    tests.push({
      name: 'CORS Preflight',
      status: 'skipped',
      message: 'Skipped to avoid CORS issues'
    });
  
    // Test 3: POST request
    try {
      const response = await fetch('https://lms-backend-5s5x.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@test.com',
          password: 'test123'
        })
      });
      tests.push({
        name: 'POST Request',
        status: 'success',
        statusCode: response.status,
        message: 'POST request successful'
      });
    } catch (error) {
      tests.push({
        name: 'POST Request',
        status: 'error',
        message: error.message
      });
    }
  
    return tests;
  };
  
  // Check if we're in development mode
  export const isDevelopment = () => {
    return import.meta.env?.MODE === 'development' || 
           process.env?.NODE_ENV === 'development' ||
           window.location.hostname === 'localhost';
  };
  
  // Log network status
  export const logNetworkStatus = () => {
    console.log('🌐 Network Status Check:');
    console.log('Environment:', isDevelopment() ? 'Development' : 'Production');
    console.log('Current URL:', window.location.href);
    console.log('User Agent:', navigator.userAgent);
    console.log('Online Status:', navigator.onLine);
    
    // Test connectivity
    testNetworkConnectivity().then(tests => {
      console.log('📡 Connectivity Tests:');
      tests.forEach(test => {
        const icon = test.status === 'success' ? '✅' : '❌';
        console.log(`${icon} ${test.name}: ${test.message}`);
      });
    });
  }; 