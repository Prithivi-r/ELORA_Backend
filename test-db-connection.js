const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Order = require('./models/Order');

async function testDatabaseConnection() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test user creation
    console.log('\n📝 Testing User Creation...');
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    await testUser.save();
    console.log('✅ User created successfully:', testUser.name);

    // Test user retrieval
    const foundUser = await User.findOne({ email: 'test@example.com' });
    console.log('✅ User retrieved:', foundUser ? foundUser.name : 'Not found');

    // Test order creation
    console.log('\n📦 Testing Order Creation...');
    const testOrder = new Order({
      userId: foundUser._id,
      products: [{
        name: 'Test Product',
        price: 100,
        quantity: 2
      }],
      totalAmount: 200,
      paymentMethod: 'COD'
    });

    await testOrder.save();
    console.log('✅ Order created successfully:', testOrder.orderId);

    // Test order retrieval with user population
    const foundOrder = await Order.findOne({ orderId: testOrder.orderId })
      .populate('userId', 'name email');
    
    console.log('✅ Order retrieved with user info:');
    console.log('   Order ID:', foundOrder.orderId);
    console.log('   User Name:', foundOrder.userId.name);
    console.log('   User Email:', foundOrder.userId.email);
    console.log('   Products:', foundOrder.products.map(p => `${p.name} (${p.quantity}x)`));

    // Cleanup test data
    await User.deleteOne({ email: 'test@example.com' });
    await Order.deleteOne({ orderId: testOrder.orderId });
    console.log('\n🧹 Test data cleaned up');

    console.log('\n✅ All database tests passed!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

testDatabaseConnection();