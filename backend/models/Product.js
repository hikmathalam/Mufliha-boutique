const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  pricePerDay: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Bridal Sets', 'Necklaces', 'Earrings & Bangles', 'Fancy Items', 'Rings', 'Anklets', 'Bridal Dresses']
  },
  images: [{ type: String, required: true }],
  isAvailable: { type: Boolean, default: true },
  features: [{ type: String }],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
