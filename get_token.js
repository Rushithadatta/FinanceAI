// Script to get auth token for testing
const axios = require('axios');

const getAuthToken = async () => {
  console.log('🔑 Getting Auth Token for Chatbot...\n');
  
  const baseURL = 'http://localhost:5000/api';
  
  const testUser = {
    mobile: '9876543210',
    password: 'TestPass123!'
  };
  
  try {
    console.log('Logging in with test user...');
    console.log('Mobile:', testUser.mobile);
    console.log('Password: ***hidden***\n');
    
    const response = await axios.post(`${baseURL}/auth/login`, testUser);
    
    console.log('✅ Login successful!');
    console.log('🎯 YOUR AUTH TOKEN:');
    console.log('==========================================');
    console.log(response.data.token);
    console.log('==========================================');
    console.log('\n📋 COPY the token above and paste it into the chatbot sidebar!');
    console.log('\n💡 This token will give the AI assistant access to your expense data');
    console.log('   so it can provide personalized financial advice based on your');
    console.log('   actual spending patterns.');
    
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data?.message || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n🔄 User might not exist. Creating test user first...');
      
      // Try to create user first
      try {
        await axios.post(`${baseURL}/auth/register`, {
          name: 'Test User',
          mobile: '9876543210',
          password: 'TestPass123!',
          userType: 'professional'
        });
        
        console.log('✅ User created! Now trying login again...');
        
        // Try login again
        const loginResponse = await axios.post(`${baseURL}/auth/login`, testUser);
        console.log('✅ Login successful!');
        console.log('🎯 YOUR AUTH TOKEN:');
        console.log('==========================================');
        console.log(loginResponse.data.token);
        console.log('==========================================');
        console.log('\n📋 COPY the token above and paste it into the chatbot sidebar!');
        
      } catch (createError) {
        console.log('❌ Failed to create user:', createError.response?.data?.message || createError.message);
      }
    }
  }
};

getAuthToken();
