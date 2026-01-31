const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  brand: { type: String, default: 'ELORA' },
  bestSeller: { type: Boolean, default: false },
  onSale: { type: Boolean, default: false },
  discount: { type: Number }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  items: [{
    id: Number,
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: 'Placed' },
  refundStatus: { type: String, default: 'Not Applicable' },
  date: { type: Date, default: Date.now }
});

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  discount: { type: Number, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
});

module.exports = {
  Product: mongoose.model('Product', productSchema),
  Order: mongoose.model('Order', orderSchema),
  User: mongoose.model('User', userSchema),
  Offer: mongoose.model('Offer', offerSchema)
};