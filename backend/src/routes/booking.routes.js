const express = require('express');
const router = express.Router();
const { z } = require('zod');
const validate = require('../middleware/validate');
const { protect, optionalAuth } = require('../middleware/auth.middleware');
const bookingController = require('../controllers/booking.controller');

const createBookingSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^(97|98)\d{8,9}$/, 'Must be a valid Nepal phone number starting with 97 or 98'),
  address: z.string().min(3, 'Address is required'),
  landmark: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  city: z.enum(['Kathmandu', 'Lalitpur', 'Bhaktapur']),
  date: z.string().min(1, 'Date is required'),
  timeSlot: z.string().min(1, 'Time slot is required'),
  items: z.array(z.string()).min(1, 'Select at least one item'),
  estimatedWeight: z.string().optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().max(500).optional()
});

router.post('/', optionalAuth, validate(createBookingSchema), bookingController.createBooking);
router.get('/my', protect, bookingController.getMyBookings);
router.get('/:id', protect, bookingController.getBookingById);
router.patch('/:id/cancel', protect, bookingController.cancelBooking);

module.exports = router;
