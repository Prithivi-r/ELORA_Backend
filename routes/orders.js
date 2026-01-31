const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authUser } = require('../middleware/auth');

const router = express.Router();

// Create order (Place Order)
router.post('/', authUser, async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    if (!['COD', 'UPI', 'CARD', 'CASHBACK'].includes(paymentMethod.toUpperCase())) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    // Get user cart
    const cart = await Cart.findOne({ userId: req.user.userId })
      .populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Check stock and calculate total
    let totalAmount = 0;
    const orderProducts = [];

    for (const item of cart.items) {
      const product = item.productId;
      
      if (!product || !product.isActive) {
        return res.status(400).json({ error: `Product ${product?.name || 'Unknown'} is no longer available` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
      }

      const price = product.finalPrice;
      totalAmount += price * item.quantity;

      orderProducts.push({
        productId: product._id,
        name: product.name,
        price: price,
        quantity: item.quantity
      });

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = new Order({
      userId: req.user.userId,
      products: orderProducts,
      totalAmount,
      paymentMethod: paymentMethod.toUpperCase(),
      orderStatus: 'confirmed',
      paymentStatus: paymentMethod.toUpperCase() === 'COD' ? 'pending' : 'paid'
    });

    await order.save();

    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: order.orderId,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user orders
router.get('/', authUser, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json(orders.map(order => ({
      id: order._id,
      orderId: order.orderId,
      products: order.products,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      isCashback: order.isCashback,
      createdAt: order.createdAt
    })));
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cancel order with refund logic
router.put('/:orderId/cancel', authUser, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      orderId: req.params.orderId,
      userId: req.user.userId 
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.orderStatus === 'cancelled') {
      return res.status(400).json({ error: 'Order already cancelled' });
    }

    if (order.orderStatus === 'delivered') {
      return res.status(400).json({ error: 'Cannot cancel delivered order' });
    }

    // Update order status
    order.orderStatus = 'cancelled';

    // Handle refund logic based on payment method
    if (order.paymentMethod === 'CASHBACK') {
      // Cashback orders - cancel only, no refund
      order.paymentStatus = 'paid'; // Keep as paid since it was cashback
    } else {
      // All other payment methods - mark as refunded (except COD which stays pending)
      if (order.paymentMethod !== 'COD') {
        order.paymentStatus = 'refunded';
      }
    }

    await order.save();

    // Restore stock for all products
    for (const item of order.products) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      );
    }

    // Generate appropriate message based on payment method
    let refundMessage;
    if (order.paymentMethod === 'CASHBACK') {
      refundMessage = 'Order cancelled successfully. No refund applicable for cashback orders.';
    } else if (order.paymentMethod === 'COD') {
      refundMessage = 'Order cancelled successfully.';
    } else {
      refundMessage = 'Order cancelled successfully. Refund will be processed within 5-7 business days.';
    }

    res.json({
      message: refundMessage,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single order details
router.get('/:orderId', authUser, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      orderId: req.params.orderId,
      userId: req.user.userId 
    })
    .populate('userId', 'name email')
    .populate('products.productId', 'name imageUrl');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      id: order._id,
      orderId: order.orderId,
      user: {
        name: order.userId?.name || 'Unknown User',
        email: order.userId?.email
      },
      products: order.products.map(p => ({
        productId: p.productId?._id,
        name: p.name,
        price: p.price,
        quantity: p.quantity,
        imageUrl: p.productId?.imageUrl
      })),
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      orderDate: order.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;