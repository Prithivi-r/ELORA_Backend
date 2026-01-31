const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Create default admin user if not exists
    const Admin = require('../models/Admin');
    const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL || 'admin@elora.com' });
    
    if (!adminExists) {
      const admin = new Admin({
        name: 'ELORA Admin',
        email: process.env.ADMIN_EMAIL || 'admin@elora.com',
        password: process.env.ADMIN_PASSWORD || 'admin123'
      });
      await admin.save();
      console.log('✅ Default admin user created');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;