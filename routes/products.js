const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

const FIELDS = ['name', 'brand', 'description', 'price', 'sizeMl', 'category', 'family', 'notes', 'image', 'stock', 'featured'];

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function pickFields(body) {
  const data = {};
  FIELDS.forEach((key) => {
    if (body[key] !== undefined) data[key] = body[key];
  });
  if (typeof data.notes === 'string') {
    data.notes = data.notes.split(',').map((n) => n.trim()).filter(Boolean);
  }
  return data;
}

function checkId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Product not found.' });
  }
  next();
}

router.get('/meta/options', (req, res) => {
  res.json({ categories: Product.CATEGORIES, families: Product.FAMILIES });
});

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { search, category, family, sort, featured } = req.query;
    const filter = {};

    if (typeof search === 'string' && search.trim()) {
      const rx = new RegExp(escapeRegex(search.trim()), 'i');
      filter.$or = [{ name: rx }, { brand: rx }, { notes: rx }];
    }
    if (Product.CATEGORIES.includes(category)) filter.category = category;
    if (Product.FAMILIES.includes(family)) filter.family = family;
    if (featured === 'true') filter.featured = true;

    const sorts = { 'price-asc': { price: 1 }, 'price-desc': { price: -1 }, newest: { createdAt: -1 } };
    const products = await Product.find(filter).sort(sorts[sort] || sorts.newest);
    res.json({ products });
  })
);

router.get(
  '/:id',
  checkId,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ product });
  })
);

router.post(
  '/',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const product = await Product.create(pickFields(req.body));
    res.status(201).json({ product });
  })
);

router.put(
  '/:id',
  protect,
  adminOnly,
  checkId,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    product.set(pickFields(req.body));
    await product.save();
    res.json({ product });
  })
);

router.delete(
  '/:id',
  protect,
  adminOnly,
  checkId,
  asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product deleted.' });
  })
);

module.exports = router;
