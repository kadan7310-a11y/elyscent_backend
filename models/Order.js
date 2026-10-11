const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        image: { type: String, default: '' },
        price: { type: Number, required: true },
        qty: { type: Number, required: true, min: 1 },
      },
    ],
    shipping: {
      fullName: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      postalCode: { type: String, default: '', trim: true },
      country: { type: String, required: true, trim: true },
    },
    paymentMethod: { type: String, default: 'Cash on delivery' },
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
