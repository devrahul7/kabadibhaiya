const Booking = require('../models/Booking');
const User = require('../models/User');

exports.getAllBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { status, city, search } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (city) query.city = city;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { bookingRef: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Booking.countDocuments(query);
    
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

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    res.json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    
    const startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);
    const todayBookings = await Booking.countDocuments({ createdAt: { $gte: startOfToday } });
    
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalRevenue = completedBookings * 1500; // Fake estimate calculation
    
    res.json({
      success: true,
      stats: { totalBookings, pendingBookings, completedBookings, todayBookings, totalUsers, totalRevenue }
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const users = await User.find({ role: 'user' })
      .select('-passwordHash -refreshToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await User.countDocuments({ role: 'user' });
    
    res.json({
      success: true,
      users,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    next(err);
  }
};
