const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');

const SALT_ROUNDS = 12;

// Cookie options
const cookieOpts = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge
});

exports.register = async (req, res, next) => {
  try {
    const { name, phone, email, password, city } = req.body;
    // Check duplicate
    const exists = await User.findOne({ $or: [{ phone }, ...(email ? [{ email }] : [])] });
    if (exists) return res.status(409).json({ success: false, message: 'Phone or email already registered' });
    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, phone, email, passwordHash, city });
    // Award 50 points for registration
    user.loyaltyPoints = 50;
    await user.save();
    // Generate tokens
    const accessToken = signAccessToken({ id: user._id, role: user.role });
    const refreshToken = signRefreshToken({ id: user._id });
    // Hash and store refresh token
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await user.save();
    res.cookie('accessToken', accessToken, cookieOpts(15 * 60 * 1000));
    res.cookie('refreshToken', refreshToken, cookieOpts(7 * 24 * 60 * 60 * 1000));
    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to KabadiBhaiya.',
      user: { id: user._id, name: user.name, phone: user.phone, email: user.email, city: user.city, role: user.role, loyaltyPoints: user.loyaltyPoints, tier: user.tier }
    });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { phoneOrEmail, password } = req.body;
    const user = await User.findOne({ $or: [{ phone: phoneOrEmail }, { email: phoneOrEmail }] });
    if (!user || !user.isActive) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    // Check account lock
    if (user.isLocked && user.isLocked()) return res.status(423).json({ success: false, message: 'Account temporarily locked. Try again later.' });
    // Compare password with bcrypt
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      if (user.loginAttempts >= 5) user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    // Reset lock
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    // Generate tokens
    const accessToken = signAccessToken({ id: user._id, role: user.role });
    const refreshToken = signRefreshToken({ id: user._id });
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await user.save();
    res.cookie('accessToken', accessToken, cookieOpts(15 * 60 * 1000));
    res.cookie('refreshToken', refreshToken, cookieOpts(7 * 24 * 60 * 60 * 1000));
    res.json({
      success: true,
      message: 'Login successful',
      user: { id: user._id, name: user.name, phone: user.phone, email: user.email, city: user.city, role: user.role, loyaltyPoints: user.loyaltyPoints, tier: user.tier }
    });
  } catch (err) { next(err); }
};

exports.logout = async (req, res, next) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    }
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) { next(err); }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

exports.updateMe = async (req, res, next) => {
  try {
    const { name, city, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, city, email, updatedAt: Date.now() },
      { new: true, select: '-passwordHash -refreshToken' }
    );
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

exports.refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: 'No refresh token' });
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);
    if (!user || !user.refreshToken) return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    const valid = await bcrypt.compare(token, user.refreshToken);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    const newAccessToken = signAccessToken({ id: user._id, role: user.role });
    res.cookie('accessToken', newAccessToken, cookieOpts(15 * 60 * 1000));
    res.json({ success: true, message: 'Token refreshed' });
  } catch (err) { next(err); }
};
