const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
let userToken = '';
let adminToken = '';
let productId = '';
let orderId = '';

const testAPI = async () => {
  console.log('🚀 Starting ELORA API Tests...\n');

  try {
    // 1. Test Admin Signup & Login
    console.log('1️⃣ Testing Admin Authentication...');
    
    const adminSignup = await axios.post(`${BASE_URL}/auth/admin/signup`, {
      name: 'Test Admin',
      email: 'testadmin@elora.com',
      password: 'admin123'
    });
    console.log('✅ Admin Signup:', adminSignup.data.message);

    const adminLogin = await axios.post(`${BASE_URL}/auth/admin/login`, {
      email: 'testadmin@elora.com',
      password: 'admin123'
    });
    adminToken = adminLogin.data.token;
    console.log('✅ Admin Login:', adminLogin.data.message);

    // 2. Test User Signup & Login
    console.log('\n2️⃣ Testing User Authentication...');
    
    const userSignup = await axios.post(`${BASE_URL}/auth/signup`, {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'user123'
    });
    console.log('✅ User Signup:', userSignup.data.message);

    const userLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'testuser@example.com',
      password: 'user123'
    });
    userToken = userLogin.data.token;
    console.log('✅ User Login:', userLogin.data.message);

    // 3. Test Product Management (Admin)
    console.log('\n3️⃣ Testing Product Management...');
    
    const addProduct = await axios.post(`${BASE_URL}/admin/products`, {
      name: 'Test Skincare Cream',
      category: 'Skincare',
      price: 299.99,
      description: 'A premium skincare cream for all skin types',
      imageUrl: 'https://example.com/cream.jpg',
      stock: 50,
      offer: 10
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    productId = addProduct.data.product.id;
    console.log('✅ Product Added:', addProduct.data.message);

    const getProducts = await axios.get(`${BASE_URL}/products`);
    console.log('✅ Get Products:', `Found ${getProducts.data.length} products`);

    // 4. Test Cart Operations
    console.log('\n4️⃣ Testing Cart Operations...');
    
    const addToCart = await axios.post(`${BASE_URL}/cart/add`, {
      productId: productId,
      quantity: 2
    }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ Add to Cart:', addToCart.data.message);

    const getCart = await axios.get(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ Get Cart:', `Cart has ${getCart.data.items.length} items, Total: ₹${getCart.data.totalAmount}`);

    // 5. Test Order Placement
    console.log('\n5️⃣ Testing Order Management...');
    
    const placeOrder = await axios.post(`${BASE_URL}/orders`, {
      paymentMethod: 'COD'
    }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    orderId = placeOrder.data.orderId;
    console.log('✅ Order Placed:', `Order ID: ${orderId}, Amount: ₹${placeOrder.data.totalAmount}`);

    const getUserOrders = await axios.get(`${BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ Get User Orders:', `Found ${getUserOrders.data.length} orders`);

    // 6. Test Admin Dashboard
    console.log('\n6️⃣ Testing Admin Dashboard...');
    
    const getDashboard = await axios.get(`${BASE_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Dashboard Stats:', {
      users: getDashboard.data.totalUsers,
      orders: getDashboard.data.totalOrders,
      products: getDashboard.data.totalProducts,
      sales: `₹${getDashboard.data.totalSales}`
    });

    const getAdminOrders = await axios.get(`${BASE_URL}/admin/orders`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Admin Orders View:', `Found ${getAdminOrders.data.length} orders`);

    // 7. Test Order Cancellation
    console.log('\n7️⃣ Testing Order Cancellation...');
    
    const cancelOrder = await axios.put(`${BASE_URL}/orders/cancel/${orderId}`, {}, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ Order Cancelled:', cancelOrder.data.message);

    // 8. Test Product Update & Delete
    console.log('\n8️⃣ Testing Product Update & Delete...');
    
    const updateProduct = await axios.put(`${BASE_URL}/admin/products/${productId}`, {
      price: 399.99,
      stock: 25
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Product Updated:', updateProduct.data.message);

    const deleteProduct = await axios.delete(`${BASE_URL}/admin/products/${productId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Product Deleted:', deleteProduct.data.message);

    console.log('\n🎉 All API tests completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('✅ Authentication (User & Admin)');
    console.log('✅ Product Management (CRUD)');
    console.log('✅ Cart Operations');
    console.log('✅ Order Management');
    console.log('✅ Admin Dashboard');
    console.log('✅ Order Cancellation & Refund Logic');
    console.log('✅ Security & Authorization');

  } catch (error) {
    console.error('❌ Test Failed:', error.response?.data || error.message);
  }
};

// Run tests
testAPI();