const express = require('express');
const Offer = require('../models/Offer');

const router = express.Router();

// Get active offers (public)
router.get('/active', async (req, res) => {
  try {
    const offers = await Offer.find({ 
      isActive: true,
      $or: [
        { expiryDate: null },
        { expiryDate: { $gte: new Date() } }
      ]
    }).select('-__v');
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate offer code
router.post('/validate', async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    
    const offer = await Offer.findOne({ 
      code: code.toUpperCase(), 
      isActive: true,
      $or: [
        { expiryDate: null },
        { expiryDate: { $gte: new Date() } }
      ]
    });
    
    if (!offer) {
      return res.status(404).json({ error: 'Invalid or expired offer code' });
    }
    
    if (orderAmount < offer.minOrderAmount) {
      return res.status(400).json({ 
        error: `Minimum order amount of ₹${offer.minOrderAmount} required for this offer` 
      });
    }
    
    let discountAmount = 0;
    if (offer.discountType === 'percentage') {
      discountAmount = (orderAmount * offer.discountValue) / 100;
      if (offer.maxDiscount && discountAmount > offer.maxDiscount) {
        discountAmount = offer.maxDiscount;
      }
    } else {
      discountAmount = offer.discountValue;
    }
    
    res.json({
      valid: true,
      offer: {
        code: offer.code,
        description: offer.description,
        discountAmount: Math.round(discountAmount),
        finalAmount: Math.round(orderAmount - discountAmount)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;