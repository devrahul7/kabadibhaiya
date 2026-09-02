const crypto = require('crypto');
const nodemailer = require('nodemailer');

/**
 * Generate a 6-digit numeric OTP
 */
exports.generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Hash an OTP using SHA-256 (lightweight, no bcrypt needed for short-lived OTPs)
 */
exports.hashOtp = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

/**
 * Verify an OTP against its hash
 */
exports.verifyOtp = (otp, hash) => {
  const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
  return otpHash === hash;
};

/**
 * Create a Gmail SMTP transporter (free)
 * Uses Gmail App Password — no paid service required
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

/**
 * Send OTP email
 * Falls back to console.log if Gmail credentials are not set (dev mode)
 */
exports.sendOtpEmail = async (toEmail, otp, userName) => {
  const isPlaceholder = !process.env.GMAIL_USER ||
    !process.env.GMAIL_APP_PASSWORD ||
    process.env.GMAIL_USER === 'your_gmail@gmail.com' ||
    process.env.GMAIL_APP_PASSWORD.includes('xxxx');

  // DEV MODE fallback
  if (isPlaceholder) {
    console.log(`\n==================================================`);
    console.log(`📧 [DEV MODE OTP]`);
    console.log(`To:   ${toEmail}`);
    console.log(`OTP:  ${otp}`);
    console.log(`User: ${userName}`);
    console.log(`Valid for 10 minutes`);
    console.log(`==================================================\n`);
    return;
  }

  try {
    const transporter = createTransporter();

  const mailOptions = {
    from: `"KabadiBhaiya Nepal" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: 'Your KabadiBhaiya Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
          .container { max-width: 500px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #e67e22, #ca6f1e); padding: 32px; text-align: center; }
          .header h1 { color: #fff; margin: 0; font-size: 24px; }
          .body { padding: 32px; }
          .otp-box { background: #fdebd0; border: 2px dashed #e67e22; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
          .otp { font-size: 40px; font-weight: 900; letter-spacing: 8px; color: #e67e22; }
          .note { color: #888; font-size: 13px; text-align: center; margin-top: 8px; }
          .footer { background: #1a1a2e; color: #888; text-align: center; padding: 16px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>♻️ KabadiBhaiya</h1>
          </div>
          <div class="body">
            <p>Hello <strong>${userName}</strong>,</p>
            <p>Your email verification code for KabadiBhaiya Nepal is:</p>
            <div class="otp-box">
              <div class="otp">${otp}</div>
              <div class="note">Valid for 10 minutes only</div>
            </div>
            <p>If you did not request this, please ignore this email.</p>
          </div>
          <div class="footer">
            &copy; 2026 KabadiBhaiya Nepal | Kathmandu, Nepal
          </div>
        </div>
      </body>
      </html>
    `,
  };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.warn('⚠️ SMTP Error (check GMAIL_USER/GMAIL_APP_PASSWORD):', err.message);
    console.log(`\n📧 [FALLBACK OTP LOG] To: ${toEmail} | OTP: ${otp} | Name: ${userName}\n`);
  }
};
