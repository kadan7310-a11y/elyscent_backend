const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');
const asyncHandler = require('../middleware/asyncHandler');
const { protect } = require('../middleware/auth');

const router = express.Router();

async function releaseStock(reserved) {
  for (const r of reserved) {
    await Product.updateOne({ _id: r.id }, { $inc: { stock: r.qty } });
  }
}

router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { items, shipping } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty.' });
    }
    const s = shipping || {};
    const required = ['fullName', 'phone', 'address', 'city', 'country'];
    for (const key of required) {
      if (!String(s[key] || '').trim()) {
        return res.status(400).json({ message: 'Fill in all required delivery details.' });
      }
    }

    // Merge duplicate lines and validate quantities
    const wanted = new Map();
    for (const line of items) {
      const id = String((line && line.product) || '');
      const qty = Number(line && line.qty);
      if (!mongoose.isValidObjectId(id) || !Number.isInteger(qty) || qty < 1 || qty > 20) {
        return res.status(400).json({ message: 'One of the cart items is invalid.' });
      }
      wanted.set(id, (wanted.get(id) || 0) + qty);
    }

    const products = await Product.find({ _id: { $in: [...wanted.keys()] } });
    if (products.length !== wanted.size) {
      return res.status(400).json({ message: 'One of the products is no longer available.' });
    }

    // Reserve stock; roll back if any line fails
    const reserved = [];
    const orderItems = [];
    let total = 0;

    for (const product of products) {
      const qty = wanted.get(product._id.toString());
      const updated = await Product.findOneAndUpdate(
        { _id: product._id, stock: { $gte: qty } },
        { $inc: { stock: -qty } }
      );
      if (!updated) {
        await releaseStock(reserved);
        return res.status(400).json({ message: `Not enough stock for ${product.name}.` });
      }
      reserved.push({ id: product._id, qty });
      total += product.price * qty;
      orderItems.push({ product: product._id, name: product.name, image: product.image, price: product.price, qty });
    }

    try {
      const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        shipping: {
          fullName: String(s.fullName).trim(),
          phone: String(s.phone).trim(),
          address: String(s.address).trim(),
          city: String(s.city).trim(),
          postalCode: String(s.postalCode || '').trim(),
          country: String(s.country).trim(),
        },
        totalPrice: Math.round(total * 100) / 100,
      });
      res.status(201).json({ order });
    } catch (err) {
      await releaseStock(reserved);
      throw err;
    }
  })
);

router.get(
  '/mine',
  protect,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  })
);

module.exports = router;
