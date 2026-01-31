const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// Get all active products (public route)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isActive: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    const formattedProducts = products.map(product => ({
      id: product._id,
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      finalPrice: product.finalPrice,
      offer: product.offer,
      stock: product.stock,
      imageUrl: product.imageUrl,
      createdAt: product.createdAt
    }));

    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product (public route)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: parseInt(req.params.id), 
      isActive: true 
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      id: product._id,
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      finalPrice: product.finalPrice,
      offer: product.offer,
      stock: product.stock,
      imageUrl: product.imageUrl,
      createdAt: product.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;