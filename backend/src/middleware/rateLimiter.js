const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 min
  max: 5,
  message: { success: false, message: 'Too many attempts. Please wait 1 minute.' },
  standardHeaders: true,
  legacyHeaders: false
});

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many chat messages. Please slow down.' }
});

module.exports = { authLimiter, chatLimiter };
