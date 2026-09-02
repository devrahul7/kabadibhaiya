const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { generateOtp, hashOtp, verifyOtp: verifyOtpHash, sendOtpEmail } = require('../utils/otp');

const SALT_ROUNDS = 12;

// ─── Cookie helpers ────────────────────────────────────────────────────────────
const cookieOpts = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge,
});

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, cookieOpts(15 * 60 * 1000));
  res.cookie('refreshToken', refreshToken, cookieOpts(7 * 24 * 60 * 60 * 1000));
};

// ─── Username generator ────────────────────────────────────────────────────────
const generateUsername = async (name) => {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 20);
  let username = base;
  let count = 0;
  while (await User.findOne({ username })) {
    count++;
    username = `${base}_${count}`;
  }
  return username;
};

// ─── REGISTER ─────────────────────────────────────────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const { name, username, phone, email, password, city } = req.body;

    // Check duplicates
    const orQuery = [{ phone }];
    if (email) orQuery.push({ email });
    if (username) orQuery.push({ username });
    const exists = await User.findOne({ $or: orQuery });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Phone, email, or username already registered' });
    }

    // Resolve username
    const resolvedUsername = username || (await generateUsername(name));

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Handle profile image (uploaded via multer)
    let profileImage, profileImageType;
    if (req.file) {
      profileImage = req.file.buffer;
      profileImageType = req.file.mimetype;
    }

    const user = await User.create({
      name,
      username: resolvedUsername,
      phone,
      email,
      passwordHash,
      city,
      profileImage,
      profileImageType,
      loyaltyPoints: 50, // Welcome bonus
    });

    // Send email OTP if email provided
    if (email) {
      const otp = generateOtp();
      user.otpCode = hashOtp(otp);
      user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
      await user.save();
      await sendOtpEmail(email, otp, name);
    } else {
      await user.save();
    }

    // Generate tokens
    const accessToken = signAccessToken({ id: user._id, role: user.role });
    const refreshToken = signRefreshToken({ id: user._id });
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);
    return res.status(201).json({
      success: true,
      message: email
        ? 'Registration successful! Check your email for the OTP to verify your phone.'
        : 'Registration successful! Welcome to KabadiBhaiya.',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        phone: user.phone,
        email: user.email,
        city: user.city,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints,
        tier: user.tier,
        isPhoneVerified: user.isPhoneVerified,
        hasProfileImage: !!profileImage,
      },
    });
  } catch (err) { next(err); }
};

// ─── SEND OTP ─────────────────────────────────────────────────────────────────
exports.sendOtp = async (req, res, next) => {
  try {
    const { emailOrPhone } = req.body;
    if (!emailOrPhone) return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!user.email) return res.status(400).json({ success: false, message: 'No email on account to send OTP' });

    const otp = generateOtp();
    user.otpCode = hashOtp(otp);
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtpEmail(user.email, otp, user.name);
    return res.json({ success: true, message: 'OTP sent to your email address' });
  } catch (err) { next(err); }
};

// ─── VERIFY OTP ───────────────────────────────────────────────────────────────
exports.verifyOtp = async (req, res, next) => {
  try {
    const { emailOrPhone, otp } = req.body;
    if (!emailOrPhone || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required' });

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!user.otpCode || !user.otpExpiry) {
      return res.status(400).json({ success: false, message: 'No OTP requested. Please request a new OTP.' });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }
    if (!verifyOtpHash(otp, user.otpCode)) {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
    }

    // Mark verified, clear OTP
    user.isPhoneVerified = true;
    user.otpCode = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return res.json({ success: true, message: 'Phone verified successfully!' });
  } catch (err) { next(err); }
};

// ─── FORGOT PASSWORD ─────────────────────────────────────────────────────────
exports.forgotPassword = async (req, res, next) => {
  try {
    const { emailOrPhone } = req.body;
    if (!emailOrPhone) {
      return res.status(400).json({ success: false, message: 'Email, phone, or username is required' });
    }

    const cleanInput = emailOrPhone.trim();
    const user = await User.findOne({
      $or: [
        { email: cleanInput.toLowerCase() },
        { phone: cleanInput },
        { username: cleanInput.toLowerCase() },
      ],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email, phone, or username' });
    }

    const otp = generateOtp();
    user.otpCode = hashOtp(otp);
    user.otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save();

    console.log(`\n🔑 [PASSWORD RESET OTP] For user ${user.name} (${user.email || user.phone}): ${otp}\n`);

    if (user.email) {
      await sendOtpEmail(user.email, otp, user.name);
    }

    return res.json({
      success: true,
      message: user.email
        ? `Password reset code sent to ${user.email} (and phone).`
        : `Password reset code generated for ${user.phone}.`,
      phone: user.phone,
      email: user.email,
    });
  } catch (err) { next(err); }
};

// ─── RESET PASSWORD ──────────────────────────────────────────────────────────
exports.resetPassword = async (req, res, next) => {
  try {
    const { emailOrPhone, otp, newPassword } = req.body;
    if (!emailOrPhone || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const cleanInput = emailOrPhone.trim();
    const user = await User.findOne({
      $or: [
        { email: cleanInput.toLowerCase() },
        { phone: cleanInput },
        { username: cleanInput.toLowerCase() },
      ],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.otpCode || !user.otpExpiry) {
      return res.status(400).json({ success: false, message: 'No password reset requested. Please request a new code.' });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'Reset code has expired. Please request a new one.' });
    }

    if (!verifyOtpHash(otp, user.otpCode)) {
      return res.status(400).json({ success: false, message: 'Invalid reset code. Please try again.' });
    }

    // Set new password
    user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.otpCode = undefined;
    user.otpExpiry = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    return res.json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.',
    });
  } catch (err) { next(err); }
};

// ─── GOOGLE AUTH ──────────────────────────────────────────────────────────────

exports.googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ success: false, message: 'Google credential is required' });

    // Verify Google ID token via Google's tokeninfo API (native fetch, official Google endpoint)
    let payload;
    try {
      const gRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
      if (!gRes.ok) throw new Error('Invalid Google Token');
      payload = await gRes.json();
    } catch (gErr) {
      return res.status(401).json({ success: false, message: 'Google verification failed: ' + gErr.message });
    }
    const { sub: googleId, email, name, picture } = payload;

    // Find or create user
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Existing user — link Google if not already linked
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // New Google user — create account
      const resolvedUsername = await generateUsername(name);
      // Fake phone for Google users (they can update later)
      const tempPhone = `97${Math.floor(10000000 + Math.random() * 90000000)}`;
      user = await User.create({
        name,
        username: resolvedUsername,
        phone: tempPhone,
        email,
        googleId,
        isPhoneVerified: true, // Google account = trusted email
        loyaltyPoints: 50,
      });
    }

    // Generate tokens
    const accessToken = signAccessToken({ id: user._id, role: user.role });
    const refreshToken = signRefreshToken({ id: user._id });
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);
    return res.json({
      success: true,
      message: 'Google login successful',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        phone: user.phone,
        email: user.email,
        city: user.city,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints,
        tier: user.tier,
        isPhoneVerified: user.isPhoneVerified,
        hasProfileImage: !!user.profileImage,
        googlePicture: picture, // pass Google picture URL for display
      },
    });
  } catch (err) { next(err); }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { phoneOrEmail, password } = req.body;

    // Accept username / phone / email
    const user = await User.findOne({
      $or: [
        { phone: phoneOrEmail },
        { email: phoneOrEmail },
        { username: phoneOrEmail.toLowerCase() },
      ]
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Google-only accounts can't use password login
    if (!user.passwordHash) {
      return res.status(401).json({ success: false, message: 'This account uses Google sign-in. Please use "Login with Google".' });
    }

    if (user.isLocked && user.isLocked()) {
      return res.status(423).json({ success: false, message: 'Account temporarily locked. Try again later.' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      if (user.loginAttempts >= 5) user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Reset lock
    user.loginAttempts = 0;
    user.lockUntil = undefined;

    const accessToken = signAccessToken({ id: user._id, role: user.role });
    const refreshToken = signRefreshToken({ id: user._id });
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);
    return res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        phone: user.phone,
        email: user.email,
        city: user.city,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints,
        tier: user.tier,
        isPhoneVerified: user.isPhoneVerified,
        hasProfileImage: !!user.profileImage,
      },
    });
  } catch (err) { next(err); }
};

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
exports.logout = async (req, res, next) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    }
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) { next(err); }
};

// ─── GET ME ───────────────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  const userObj = req.user.toObject ? req.user.toObject() : { ...req.user };
  userObj.hasProfileImage = !!req.user.profileImage;
  res.json({ success: true, user: userObj });
};

// ─── UPDATE ME ────────────────────────────────────────────────────────────────
exports.updateMe = async (req, res, next) => {
  try {
    const updates = { updatedAt: Date.now() };
    if (req.body.name) updates.name = req.body.name.trim();
    if (req.body.city) updates.city = req.body.city;
    if (req.body.email) updates.email = req.body.email.trim().toLowerCase();
    if (req.body.username) updates.username = req.body.username.toLowerCase().trim();
    if (req.file) {
      updates.profileImage = req.file.buffer;
      updates.profileImageType = req.file.mimetype;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    );
    const userObj = user.toObject();
    userObj.hasProfileImage = !!user.profileImage;
    return res.json({ success: true, user: userObj, message: 'Profile updated successfully' });
  } catch (err) { next(err); }
};


// ─── SERVE AVATAR ─────────────────────────────────────────────────────────────
exports.getAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select('profileImage profileImageType');
    if (!user || !user.profileImage) {
      return res.status(404).json({ success: false, message: 'No avatar found' });
    }
    res.set('Content-Type', user.profileImageType || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=86400');
    return res.send(user.profileImage);
  } catch (err) { next(err); }
};

// ─── REFRESH TOKEN ────────────────────────────────────────────────────────────
exports.refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: 'No refresh token' });
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);
    if (!user || !user.refreshToken) return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    const valid = await bcrypt.compare(token, user.refreshToken);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    const newAccessToken = signAccessToken({ id: user._id, role: user.role });
    res.cookie('accessToken', newAccessToken, cookieOpts(15 * 60 * 1000));
    return res.json({ success: true, message: 'Token refreshed' });
  } catch (err) { next(err); }
};
