const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Skincare', 'Makeup', 'Fragrance', 'Accessories']
  },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  offer: { type: Number, default: 0, min: 0, max: 100 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true, _id: false });

// Virtual for final price after discount
productSchema.virtual('finalPrice').get(function() {
  return this.offer > 0 ? this.price * (1 - this.offer / 100) : this.price;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Product', productSchema);