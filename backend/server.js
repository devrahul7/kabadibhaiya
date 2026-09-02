require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const bookingRoutes = require('./src/routes/booking.routes');
const priceRoutes = require('./src/routes/price.routes');
const blogRoutes = require('./src/routes/blog.routes');
const adminRoutes = require('./src/routes/admin.routes');
const chatRoutes = require('./src/routes/chat.routes');

const app = express();

// Connect DB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '10kb' })); // Prevent large payloads
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize()); // Prevent NoSQL injection

// Global rate limiter
const limiter = rateLimit({ windowMs: 15*60*1000, max: 100 });
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK', service: 'KabadiBhaiya API' }));

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`KabadiBhaiya API running on port ${PORT}`));
