const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@elora.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      name: 'ELORA Admin',
      email: 'admin@elora.com',
      password: 'admin123',
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log('Email: admin@elora.com');
    console.log('Password: admin123');
    console.log('Role: admin');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

seedAdmin();