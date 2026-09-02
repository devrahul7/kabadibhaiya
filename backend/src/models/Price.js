const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  nameNp: { type: String, trim: true },
  category: {
    type: String,
    enum: ['metal', 'paper', 'plastic', 'electronics', 'glass', 'other'],
    default: 'metal',
    lowercase: true,
  },
  price: { type: Number, required: true, min: 0 },
  unit: { type: String, default: 'kg' },
  trend: { type: String, enum: ['up', 'down', 'stable'], default: 'stable' },
  history: { type: [Number], default: [] },
  emoji: { type: String, default: '📦' },
  imageUrl: { type: String }, // External URL fallback
  itemImage: { type: Buffer }, // Binary image stored in MongoDB
  itemImageType: { type: String, default: 'image/jpeg' },
  notes: String,
  notesNp: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

priceSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.hasItemImage = !!ret.itemImage;
    delete ret.itemImage; // Keep payload fast and lightweight
    return ret;
  }
});

module.exports = mongoose.model('Price', priceSchema);
