const express = require('express');
const router = express.Router();
const { z } = require('zod');
const validate = require('../middleware/validate');
const { protect, optionalAuth } = require('../middleware/auth.middleware');
const bookingController = require('../controllers/booking.controller');

const createBookingSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^(97|98)\d{8}$/, 'Must be a valid Nepal phone number starting with 97 or 98'),
  address: z.string().min(5, 'Address is required'),
  city: z.enum(['Kathmandu', 'Lalitpur', 'Bhaktapur']),
  date: z.string().refine(val => new Date(val) >= new Date(new Date().setHours(0,0,0,0)), 'Date cannot be in the past'),
  timeSlot: z.enum(['9-11', '11-1', '2-4', '4-6']),
  items: z.array(z.string()).min(1, 'Select at least one item'),
  estimatedWeight: z.string().optional(),
  paymentMethod: z.enum(['cash', 'esewa', 'khalti', 'imepay', 'bank']).optional(),
  notes: z.string().max(500).optional()
});

router.post('/', optionalAuth, validate(createBookingSchema), bookingController.createBooking);
router.get('/my', protect, bookingController.getMyBookings);
router.get('/:id', protect, bookingController.getBookingById);
router.patch('/:id/cancel', protect, bookingController.cancelBooking);

module.exports = router;
