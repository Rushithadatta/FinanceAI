// Script to create a test user for testing login
const axios = require('axios');

const createTestUser = async () => {
  console.log('👤 Creating Test User...\n');
  
  const baseURL = 'https://expense-tracker-backend.onrender.com/api';
  
  const testUser = {
    name: 'Test User',
    mobile: '9876543210',
    password: 'TestPass123!',
    userType: 'student'
  };
  
  try {
    console.log('Creating user with data:', {
      ...testUser,
      password: '***hidden***'
    });
    
    const response = await axios.post(`${baseURL}/auth/register`, testUser);
    
    console.log('✅ Test user created successfully!');
    console.log('📋 Login Details:');
    console.log('   Mobile: 9876543210');
    console.log('   Password: TestPass123!');
    console.log('   User Type: student');
    console.log('\n🎯 Now you can test login in the frontend!');
    
  } catch (error) {
    if (error.response?.status === 400 && error.response.data.message.includes('already exists')) {
      console.log('✅ Test user already exists!');
      console.log('📋 Login Details:');
      console.log('   Mobile: 9876543210');
      console.log('   Password: TestPass123!');
      console.log('\n🎯 You can now test login in the frontend!');
    } else {
      console.log('❌ Error creating user:', error.response?.data || error.message);
    }
  }
};

createTestUser().catch(console.error);
