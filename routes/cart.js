const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authUser } = require('../middleware/auth');

const router = express.Router();

// Get user cart
router.get('/', authUser, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.userId })
      .populate('items.productId');

    if (!cart) {
      cart = new Cart({ userId: req.user.userId, items: [] });
      await cart.save();
      return res.json({ items: [], total: 0 });
    }

    let total = 0;
    const items = cart.items
      .filter(item => item.productId && item.productId.isActive)
      .map(item => {
        const itemTotal = item.productId.finalPrice * item.quantity;
        total += itemTotal;
        return {
          id: item.productId._id,
          name: item.productId.name,
          price: item.productId.finalPrice,
          quantity: item.quantity,
          image: item.productId.imageUrl,
          stock: item.productId.stock
        };
      });

    res.json({ items, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to cart
router.post('/add', authUser, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const numericProductId = Number(productId);

    if (!numericProductId || isNaN(numericProductId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await Product.findOne({ _id: numericProductId, isActive: true });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
      cart = new Cart({ userId: req.user.userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId === numericProductId);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({ productId: numericProductId, quantity });
    }

    await cart.save();
    res.json({ message: 'Product added to cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update cart item quantity
router.put('/update', authUser, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const numericProductId = Number(productId);

    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.find(item => item.productId === numericProductId);

    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(item => item.productId !== numericProductId);
    } else {
      const product = await Product.findOne({ _id: numericProductId });
      if (product && product.stock < quantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }
      item.quantity = quantity;
    }

    await cart.save();
    res.json({ message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove from cart
router.delete('/remove/:productId', authUser, async (req, res) => {
  try {
    const numericProductId = Number(req.params.productId);
    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId !== numericProductId);

    await cart.save();
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear cart
router.delete('/clear', authUser, async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user.userId },
      { items: [] }
    );
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;