const mongoose = require('mongoose');
require('dotenv').config();

async function clearCarts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Drop the carts collection to remove duplicate key issues
    await mongoose.connection.db.dropCollection('carts');
    console.log('Cleared carts collection');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

clearCarts();