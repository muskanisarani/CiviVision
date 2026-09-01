const nodemailer = require('nodemailer');

// In-memory OTP storage: email -> { otp, expiresAt, attempts }
const otpCache = new Map();

/**
 * Configure Nodemailer Transporter
 */
function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  // Fallback for development / local testing
  return null;
}

/**
 * Generate a secure 6-digit numeric OTP and cache it
 */
function generateAndStoreOTP(email) {
  const normalizedEmail = email.toLowerCase().trim();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpCache.set(normalizedEmail, {
    otp,
    expiresAt,
    attempts: 0
  });

  return otp;
}

/**
 * Verify OTP
 */
function verifyOTP(email, submittedOtp) {
  const normalizedEmail = email.toLowerCase().trim();
  const entry = otpCache.get(normalizedEmail);

  if (!entry) {
    return { success: false, error: 'OTP has expired or was not requested. Please request a new OTP.' };
  }

  if (Date.now() > entry.expiresAt) {
    otpCache.delete(normalizedEmail);
    return { success: false, error: 'OTP has expired. Please request a new OTP.' };
  }

  if (entry.attempts >= 5) {
    otpCache.delete(normalizedEmail);
    return { success: false, error: 'Too many incorrect attempts. Please request a new OTP.' };
  }

  if (entry.otp !== submittedOtp.toString().trim()) {
    entry.attempts++;
    return { success: false, error: 'Invalid verification code. Please check and try again.' };
  }

  // OTP is valid - delete from cache to prevent reuse
  otpCache.delete(normalizedEmail);
  return { success: true };
}

/**
 * Send Professional HTML Email with OTP
 */
async function sendRegistrationOTP(email, name = 'Citizen') {
  const otp = generateAndStoreOTP(email);
  const transporter = createTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #0f172a; }
        .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); padding: 28px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 6px 0 0 0; font-size: 12px; opacity: 0.9; text-transform: uppercase; letter-spacing: 1px; }
        .body { padding: 32px 28px; }
        .greeting { font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 12px; }
        .text { font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px; }
        .otp-box { background: #f1f5f9; border: 2px dashed #6366f1; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px; }
        .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #4338ca; font-family: 'Courier New', monospace; }
        .otp-note { font-size: 12px; color: #64748b; margin-top: 6px; }
        .footer { background: #f8fafc; padding: 18px 28px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>CiviVision</h1>
          <p>Gujarat Municipal Corporation</p>
        </div>
        <div class="body">
          <div class="greeting">Hello ${name},</div>
          <div class="text">
            Thank you for registering on <strong>CiviVision</strong>. Please use the verification code below to verify your email address and complete your citizen account setup.
          </div>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <div class="otp-note">Valid for 10 minutes • Do not share this code with anyone</div>
          </div>
          <div class="text" style="font-size: 13px; color: #64748b; margin-bottom: 0;">
            If you did not request this registration code, please ignore this email.
          </div>
        </div>
        <div class="footer">
          © 2026 CiviVision Civic Portal • Swachh Bharat Municipal Automation
        </div>
      </div>
    </body>
    </html>
  `;

  console.log(`\n========================================`);
  console.log(`📬 [CiviVision OTP Delivery]`);
  console.log(`To: ${email}`);
  console.log(`Verification Code: ${otp}`);
  console.log(`Expires in: 10 minutes`);
  console.log(`========================================\n`);

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"CiviVision Municipal Portal" <noreply@civivision.gov.in>',
        to: email,
        subject: `Your CiviVision Verification Code: ${otp}`,
        html: htmlContent
      });
      return { success: true, deliveredVia: 'smtp', otp };
    } catch (err) {
      console.error('SMTP sending error:', err);
      return { success: true, deliveredVia: 'console_fallback', otp, error: err.message };
    }
  }

  return { success: true, deliveredVia: 'dev_console', otp };
}

module.exports = {
  generateAndStoreOTP,
  verifyOTP,
  sendRegistrationOTP
};
