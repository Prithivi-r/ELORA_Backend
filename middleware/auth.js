const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authenticate user
const authUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'elora_secret');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token. User not found.' });
    }

    req.user = { userId: user._id, role: user.role, name: user.name };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// Authenticate admin
const authAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'elora_secret');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required.' });
    }

    req.user = { userId: user._id, role: user.role, name: user.name };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = { authUser, authAdmin };