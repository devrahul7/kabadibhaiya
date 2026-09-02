const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { authLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload');
const authController = require('../controllers/auth.controller');

// ─── Validation schemas ───────────────────────────────────────────────────────

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username max 30 characters')
    .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, underscores')
    .optional()
    .or(z.literal('')),
  phone: z.string().regex(/^(97|98)\d{8,9}$/, 'Must be a valid Nepal phone number starting with 97 or 98'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, 'Password must contain at least one letter and one number'),
  city: z.enum(['Kathmandu', 'Lalitpur', 'Bhaktapur'], {
    errorMap: () => ({ message: 'City must be Kathmandu, Lalitpur, or Bhaktapur' }),
  }),
});

const loginSchema = z.object({
  phoneOrEmail: z.string().min(3, 'Username, phone, or email is required'),
  password: z.string().min(1, 'Password is required'),
});

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  username: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/).optional().or(z.literal('')),
  city: z.enum(['Kathmandu', 'Lalitpur', 'Bhaktapur']).optional(),
  email: z.string().email().optional().or(z.literal('')),
});

const sendOtpSchema = z.object({
  emailOrPhone: z.string().min(5, 'Email or phone is required'),
});

const verifyOtpSchema = z.object({
  emailOrPhone: z.string().min(5, 'Email or phone is required'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

const forgotPasswordSchema = z.object({
  emailOrPhone: z.string().min(3, 'Email, phone, or username is required'),
});


const resetPasswordSchema = z.object({
  emailOrPhone: z.string().min(3, 'Email, phone, or username is required'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, 'Password must contain at least one letter and one number'),
});

const googleAuthSchema = z.object({
  credential: z.string().min(10, 'Google credential is required'),
});

// ─── Routes ───────────────────────────────────────────────────────────────────

// Register with optional profile image upload
router.post(
  '/register',
  authLimiter,
  upload.single('profileImage'),
  validate(registerSchema),
  authController.register
);

// Login with username / phone / email + password
router.post('/login', authLimiter, validate(loginSchema), authController.login);

// Google OAuth (credential = Google ID token from frontend)
router.post('/google', authLimiter, validate(googleAuthSchema), authController.googleAuth);

// OTP & Password Reset
router.post('/send-otp', authLimiter, validate(sendOtpSchema), authController.sendOtp);
router.post('/verify-otp', authLimiter, validate(verifyOtpSchema), authController.verifyOtp);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), authController.resetPassword);

// Protected routes
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);
router.put('/me', protect, upload.single('profileImage'), validate(updateSchema), authController.updateMe);
router.post('/refresh', authController.refresh);

// Serve profile image (public)
router.get('/avatar/:userId', authController.getAvatar);

module.exports = router;

