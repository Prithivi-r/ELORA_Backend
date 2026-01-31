const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing ELORA API...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health:', health.data);

    // Test signup
    console.log('\n2. Testing user signup...');
    const signup = await axios.post(`${BASE_URL}/auth/signup`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Signup successful');
    const token = signup.data.token;

    // Test login
    console.log('\n3. Testing user login...');
    const login = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Login successful');

    // Test products
    console.log('\n4. Testing products endpoint...');
    const products = await axios.get(`${BASE_URL}/products`);
    console.log(`✅ Products: ${products.data.length} items found`);

    // Test cart (requires auth)
    console.log('\n5. Testing cart endpoint...');
    const cart = await axios.get(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Cart:', cart.data);

    console.log('\n🎉 All API tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = testAPI;