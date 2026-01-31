const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    productId: { type: Number, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 }
  }]
}, { timestamps: true });

cartSchema.methods.calculateTotal = async function() {
  await this.populate('items.productId');
  let total = 0;
  this.items.forEach(item => {
    if (item.productId && item.productId.isActive) {
      total += item.productId.finalPrice * item.quantity;
    }
  });
  return total;
};

module.exports = mongoose.model('Cart', cartSchema);