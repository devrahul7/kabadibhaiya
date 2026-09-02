const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Core identity
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  username: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-z0-9_]+$/
  },
  phone: { type: String, required: true, unique: true, match: /^(97|98)\d{8,9}$/ },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },

  // Auth
  passwordHash: { type: String }, // optional for Google-only users
  googleId: { type: String, unique: true, sparse: true },

  // Profile image stored in MongoDB as binary
  profileImage: { type: Buffer },
  profileImageType: { type: String, default: 'image/jpeg' }, // mime type

  // Phone verification
  isPhoneVerified: { type: Boolean, default: false },

  // Email OTP for phone verification
  otpCode: { type: String },    // SHA-256 hashed OTP
  otpExpiry: { type: Date },

  // User settings
  city: { type: String, enum: ['Kathmandu', 'Lalitpur', 'Bhaktapur'], default: 'Kathmandu' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },

  // Gamification
  loyaltyPoints: { type: Number, default: 0 },
  tier: { type: String, enum: ['bronze', 'silver', 'gold'], default: 'bronze' },

  // Security
  refreshToken: String,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  isActive: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-update tier based on loyalty points
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

// Strip sensitive fields from JSON output
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.passwordHash;
    delete ret.refreshToken;
    delete ret.otpCode;
    delete ret.otpExpiry;
    delete ret.profileImage; // served via dedicated endpoint
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
