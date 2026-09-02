const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  phone: { type: String, required: true, unique: true, match: /^(97|98)\d{8}$/ },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  city: { type: String, enum: ['Kathmandu', 'Lalitpur', 'Bhaktapur'], default: 'Kathmandu' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  loyaltyPoints: { type: Number, default: 0 },
  tier: { type: String, enum: ['bronze', 'silver', 'gold'], default: 'bronze' },
  refreshToken: String,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  if (this.loyaltyPoints >= 2000) {
    this.tier = 'gold';
  } else if (this.loyaltyPoints >= 500) {
    this.tier = 'silver';
  } else {
    this.tier = 'bronze';
  }
  next();
});

userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

userSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.passwordHash;
    delete ret.refreshToken;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
