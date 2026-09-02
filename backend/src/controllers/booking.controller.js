const Booking = require('../models/Booking');
const User = require('../models/User');
const generateBookingId = require('../utils/generateBookingId');

exports.createBooking = async (req, res, next) => {
  try {
    const bookingData = { ...req.body, bookingRef: generateBookingId() };
    
    if (req.user) {
      bookingData.userId = req.user._id;
      // Award loyalty points
      await User.findByIdAndUpdate(req.user._id, { $inc: { loyaltyPoints: 10 } });
    }

    const booking = await Booking.create(bookingData);
    res.status(201).json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Booking.countDocuments({ userId: req.user._id });
    
    res.json({
      success: true,
      bookings,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    next(err);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    if (req.user.role !== 'admin' && booking.userId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    res.json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    if (booking.userId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: `Cannot cancel a ${booking.status} booking` });
    }

    booking.status = 'cancelled';
    await booking.save();
    
    res.json({ success: true, booking, message: 'Booking cancelled successfully' });
  } catch (err) {
    next(err);
  }
};
