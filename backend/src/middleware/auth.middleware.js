const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('-passwordHash -refreshToken');
    if (!user || !user.isActive) return res.status(401).json({ success: false, message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = verifyAccessToken(token);
      req.user = await User.findById(decoded.id).select('-passwordHash -refreshToken');
    }
  } catch {}
  next();
};

module.exports = { protect, optionalAuth };
