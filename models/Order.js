const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    productId: { type: Number, ref: 'Product' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    isCashback: { type: Boolean, default: false }
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    required: true,
    enum: ['COD', 'CARD', 'UPI']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  orderStatus: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
  },
  isCashback: { type: Boolean, default: false }
}, { timestamps: true });

// Generate unique order ID
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    this.orderId = 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);