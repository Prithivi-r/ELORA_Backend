const express = require('express');
const authRoutes = require('../routes/auth');
const productRoutes = require('../routes/products');
const cartRoutes = require('../routes/cart');
const orderRoutes = require('../routes/orders');
const adminRoutes = require('../routes/admin');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'ELORA API is running' });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);

module.exports = router;