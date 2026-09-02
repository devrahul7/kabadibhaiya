const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingRef: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  address: { type: String, required: true },
  city: { type: String, enum: ['Kathmandu', 'Lalitpur', 'Bhaktapur'], required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, enum: ['9-11', '11-1', '2-4', '4-6'], required: true },
  items: [{ type: String }],
  estimatedWeight: String,
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  notes: String,
  paymentMethod: { type: String, enum: ['cash', 'esewa', 'khalti', 'imepay', 'bank'], default: 'cash' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

bookingSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
