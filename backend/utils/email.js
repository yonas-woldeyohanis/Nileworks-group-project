const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOtpEmail = async (toEmail, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: 'NileWorks – Password Reset Code',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #071220, #1B3A6B); padding: 24px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: #F5A623; margin: 0; font-size: 28px; letter-spacing: 2px;">🌊 NileWorks</h1>
        </div>
        <div style="background: #fff; padding: 32px; border: 1px solid #E2E8F0; border-radius: 0 0 16px 16px;">
          <h2 style="color: #0D1B2A; margin-top: 0;">Password Reset</h2>
          <p style="color: #4A5568;">Use this 6-digit code to reset your password. It expires in <strong>10 minutes</strong>.</p>
          <div style="background: #F8F9FA; border: 2px dashed #1B3A6B; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
            <span style="font-size: 40px; font-weight: 700; letter-spacing: 12px; color: #1B3A6B;">${otp}</span>
          </div>
          <p style="color: #9BA3AF; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      </div>
    `,
  });
};

exports.sendWelcomeEmail = async (toEmail, name) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: 'Welcome to NileWorks! 🌊',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #071220, #1B3A6B); padding: 24px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: #F5A623; margin: 0; font-size: 28px; letter-spacing: 2px;">🌊 NileWorks</h1>
        </div>
        <div style="background: #fff; padding: 32px; border: 1px solid #E2E8F0; border-radius: 0 0 16px 16px;">
          <h2 style="color: #0D1B2A;">Welcome, ${name}! 👋</h2>
          <p style="color: #4A5568;">Your account is ready. Start exploring job opportunities built for Ethiopian students — flow into your career with NileWorks!</p>
          <p style="color: #9BA3AF; font-size: 13px;">The NileWorks Team 🌊</p>
        </div>
      </div>
    `,
  });
};
