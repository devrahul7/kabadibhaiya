const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  name: String,
  nameNp: String,
  category: { type: String, enum: ['metal', 'paper', 'plastic', 'electronics', 'glass'] },
  price: Number,
  unit: { type: String, default: 'per kg' },
  trend: { type: String, enum: ['up', 'down', 'stable'] },
  history: [Number],
  icon: String,
  color: String,
  notes: String,
  notesNp: String,
  isActive: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Price', priceSchema);
