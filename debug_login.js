// Test script to debug the login API issue
const axios = require('axios');

const testLogin = async () => {
  console.log('🧪 Testing Backend Login API...\n');
  
  const baseURL = 'https://expense-tracker-backend.onrender.com/api';
  
  // Test server connection
  try {
    console.log('1. Testing server connection...');
    const response = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Server is running');
    console.log('   Health check:', response.data.message);
  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
    return;
  }
  
  // Test login with invalid data (should get 400)
  try {
    console.log('\n2. Testing login with invalid data...');
    const response = await axios.post(`${baseURL}/auth/login`, {
      mobile: 'invalid',
      password: 'short'
    });
    console.log('❌ Should have failed validation');
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ Validation working (400 error expected)');
      console.log('   Error message:', error.response.data.message);
      console.log('   Validation errors:', error.response.data.errors);
    } else {
      console.log('❌ Unexpected error:', error.message);
    }
  }
  
  // Test login with valid format but non-existent user
  try {
    console.log('\n3. Testing login with valid format but non-existent user...');
    const response = await axios.post(`${baseURL}/auth/login`, {
      mobile: '9876543210',
      password: 'TestPassword123!'
    });
    console.log('❌ Should have failed (user not found)');
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ Non-existent user handled correctly');
      console.log('   Error message:', error.response.data.message);
    } else {
      console.log('❌ Unexpected error:', error.message);
    }
  }
  
  console.log('\n🎯 To fix the frontend issue:');
  console.log('1. Check browser developer tools Network tab');
  console.log('2. Look at the exact request being sent');
  console.log('3. Make sure mobile number format is correct (10 digits, starts with 6-9)');
  console.log('4. Make sure password meets requirements');
};

testLogin().catch(console.error);
