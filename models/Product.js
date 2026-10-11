const mongoose = require('mongoose');

const CATEGORIES = ['Women', 'Men', 'Unisex'];
const FAMILIES = ['Floral', 'Woody', 'Citrus', 'Amber', 'Fresh', 'Gourmand'];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 120 },
    brand: { type: String, trim: true, default: 'Elyscents', maxlength: 80 },
    description: { type: String, trim: true, default: '', maxlength: 2000 },
    price: { type: Number, required: [true, 'Price is required'], min: [0, 'Price cannot be negative'] },
    sizeMl: { type: Number, default: 50, min: 1 },
    category: { type: String, enum: CATEGORIES, default: 'Unisex' },
    family: { type: String, enum: FAMILIES, default: 'Floral' },
    notes: { type: [String], default: [] },
    image: { type: String, trim: true, default: '' },
    stock: { type: Number, default: 0, min: [0, 'Stock cannot be negative'] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
Product.CATEGORIES = CATEGORIES;
Product.FAMILIES = FAMILIES;

module.exports = Product;
