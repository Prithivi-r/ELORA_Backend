const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Offer = require('../models/Offer');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Get all users (admin only)
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    console.log('Found users:', users.length);
    res.json(users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    })));
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete user (admin only)
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.role === 'admin') {
      return res.status(400).json({ error: 'Cannot delete admin user' });
    }
    
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all orders (admin only)
router.get('/orders', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId', 'name email');
    console.log('Found orders:', orders.length);
    res.json(orders.map(order => ({
      id: order._id,
      orderId: order.orderId,
      userId: order.userId,
      products: order.products,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt
    })));
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete product (admin only)
router.delete('/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    await Product.findByIdAndDelete(parseInt(req.params.id));
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new product (admin only)
router.post('/products', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, price, category, description, imageUrl, stock, offer } = req.body;
    
    // Get the highest existing ID and increment
    const lastProduct = await Product.findOne().sort({ _id: -1 });
    const newId = lastProduct ? lastProduct._id + 1 : 1;
    
    const product = new Product({
      _id: newId,
      name,
      price: parseInt(price),
      category,
      description,
      imageUrl,
      stock: parseInt(stock),
      offer: parseInt(offer) || 0,
      isActive: true
    });
    
    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product (admin only)
router.put('/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, price, category, description, imageUrl, stock, offer } = req.body;
    
    const product = await Product.findByIdAndUpdate(
      parseInt(req.params.id),
      {
        name,
        price: parseInt(price),
        category,
        description,
        imageUrl,
        stock: parseInt(stock),
        offer: parseInt(offer) || 0
      },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all offers (admin only)
router.get('/offers', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const offers = await Offer.find({});
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new offer (admin only)
router.post('/offers', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { code, description, discountType, discountValue, minOrderAmount, maxDiscount, expiryDate } = req.body;
    
    const offer = new Offer({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount || 0,
      maxDiscount,
      expiryDate: expiryDate ? new Date(expiryDate) : null
    });
    
    await offer.save();
    res.status(201).json({ message: 'Offer created successfully', offer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update offer (admin only)
router.put('/offers/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { code, description, discountType, discountValue, minOrderAmount, maxDiscount, expiryDate, isActive } = req.body;
    
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      {
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue,
        minOrderAmount: minOrderAmount || 0,
        maxDiscount,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        isActive
      },
      { new: true }
    );
    
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    
    res.json({ message: 'Offer updated successfully', offer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete offer (admin only)
router.delete('/offers/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    res.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;