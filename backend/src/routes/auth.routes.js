const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { authLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth.middleware');
const authController = require('../controllers/auth.controller');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^(97|98)\d{8}$/, 'Must be a valid Nepal phone number starting with 97 or 98'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/^(?=.*[a-zA-Z])(?=.*\d)/, 'Password must contain at least one letter and one number'),
  city: z.enum(['Kathmandu', 'Lalitpur', 'Bhaktapur'], { errorMap: () => ({ message: 'City must be Kathmandu, Lalitpur, or Bhaktapur' }) })
});

const loginSchema = z.object({
  phoneOrEmail: z.string().min(5, 'Phone or email is required'),
  password: z.string().min(1, 'Password is required')
});

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  city: z.enum(['Kathmandu', 'Lalitpur', 'Bhaktapur']).optional(),
  email: z.string().email().optional().or(z.literal(''))
});

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);
router.put('/me', protect, validate(updateSchema), authController.updateMe);
router.post('/refresh', authController.refresh);

module.exports = router;
