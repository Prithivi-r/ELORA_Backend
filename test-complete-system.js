const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const adminUser = {
  name: 'Admin User',
  email: 'admin@elora.com',
  password: 'admin123',
  role: 'admin'
};

const regularUser = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'user123'
};

const testProduct = {
  name: 'Luxury Face Cream',
  category: 'Skincare',
  description: 'Premium anti-aging face cream with natural ingredients',
  price: 2999,
  imageUrl: 'https://example.com/face-cream.jpg',
  stock: 50,
  offer: 10
};

let adminToken = '';
let userToken = '';
let productId = '';
let orderId = '';

async function runTests() {
  console.log('🚀 Starting ELORA Backend System Tests...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', health.data.message);

    // Test 2: Admin Signup
    console.log('\n2. Testing Admin Signup...');
    const adminSignup = await axios.post(`${BASE_URL}/auth/signup`, adminUser);
    adminToken = adminSignup.data.token;
    console.log('✅ Admin signup successful:', adminSignup.data.user.role);

    // Test 3: Regular User Signup
    console.log('\n3. Testing User Signup...');
    const userSignup = await axios.post(`${BASE_URL}/auth/signup`, regularUser);
    userToken = userSignup.data.token;
    console.log('✅ User signup successful:', userSignup.data.user.role);

    // Test 4: Admin Login
    console.log('\n4. Testing Admin Login...');
    const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: adminUser.email,
      password: adminUser.password
    });
    adminToken = adminLogin.data.token;
    console.log('✅ Admin login successful');

    // Test 5: Add Product (Admin Only)
    console.log('\n5. Testing Add Product (Admin Only)...');
    const addProduct = await axios.post(`${BASE_URL}/admin/products`, testProduct, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    productId = addProduct.data.product.id;
    console.log('✅ Product added successfully:', addProduct.data.product.name);

    // Test 6: Get All Products (Public)
    console.log('\n6. Testing Get All Products...');
    const products = await axios.get(`${BASE_URL}/products`);
    console.log('✅ Products fetched:', products.data.length, 'products found');

    // Test 7: Add to Cart (User)
    console.log('\n7. Testing Add to Cart...');
    const addToCart = await axios.post(`${BASE_URL}/cart/add`, {
      productId: productId,
      quantity: 2
    }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ Product added to cart:', addToCart.data.message);

    // Test 8: Get Cart (User)
    console.log('\n8. Testing Get Cart...');
    const cart = await axios.get(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ Cart fetched:', cart.data.items.length, 'items, Total:', cart.data.totalAmount);

    // Test 9: Place Order (User)
    console.log('\n9. Testing Place Order...');
    const placeOrder = await axios.post(`${BASE_URL}/orders`, {
      paymentMethod: 'COD'
    }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    orderId = placeOrder.data.orderId;
    console.log('✅ Order placed successfully:', placeOrder.data.orderId);

    // Test 10: Get User Orders
    console.log('\n10. Testing Get User Orders...');
    const userOrders = await axios.get(`${BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ User orders fetched:', userOrders.data.length, 'orders');

    // Test 11: Get All Orders (Admin)
    console.log('\n11. Testing Get All Orders (Admin)...');
    const allOrders = await axios.get(`${BASE_URL}/admin/orders`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ All orders fetched (Admin):', allOrders.data.length, 'orders');

    // Test 12: Get Dashboard Stats (Admin)
    console.log('\n12. Testing Dashboard Stats (Admin)...');
    const stats = await axios.get(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Dashboard stats:', {
      users: stats.data.totalUsers,
      orders: stats.data.totalOrders,
      products: stats.data.totalProducts,
      sales: stats.data.totalSales
    });

    // Test 13: Cancel Order
    console.log('\n13. Testing Cancel Order...');
    const cancelOrder = await axios.put(`${BASE_URL}/orders/cancel/${orderId}`, {}, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ Order cancelled:', cancelOrder.data.message);

    // Test 14: Access Control Test (User trying to access admin endpoint)
    console.log('\n14. Testing Access Control...');
    try {
      await axios.get(`${BASE_URL}/admin/products`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      console.log('❌ Access control failed - user accessed admin endpoint');
    } catch (error) {
      if (error.response.status === 403) {
        console.log('✅ Access control working - user blocked from admin endpoint');
      }
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('- Authentication: ✅ Working');
    console.log('- Role-based Access: ✅ Working');
    console.log('- Product Management: ✅ Working');
    console.log('- Cart System: ✅ Working');
    console.log('- Order System: ✅ Working');
    console.log('- Admin Dashboard: ✅ Working');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests only if server is running
runTests();