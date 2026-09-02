const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const adminOnly = require('../middleware/admin.middleware');

router.use(protect, adminOnly);

router.get('/bookings', adminController.getAllBookings);
router.patch('/bookings/:id/status', adminController.updateBookingStatus);
router.get('/stats', adminController.getStats);
router.get('/users', adminController.getAllUsers);

module.exports = router;
