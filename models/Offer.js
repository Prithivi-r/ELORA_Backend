const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  description: { type: String, required: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscount: { type: Number },
  isActive: { type: Boolean, default: true },
  expiryDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);
