const { Student, Employer, User } = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, generateOtp } = require('../utils/jwt');
const { sendOtpEmail, sendWelcomeEmail } = require('../utils/email');
const { asyncHandler } = require('../middleware/errorHandler');

// ─── Helper: send tokens ──────────────────────────────────────────────────────
const sendTokens = async (user, res, statusCode = 200) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Store hashed refresh token
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.status(statusCode).json({
    success: true,
    data: { accessToken, refreshToken, user: sanitizeUser(user) },
  });
};

const sanitizeUser = (user) => ({
  _id: user._id,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  logo: user.logo,
  fullName: user.fullName,
  companyName: user.companyName,
  university: user.university,
  department: user.department,
  yearOfStudy: user.yearOfStudy,
  skills: user.skills,
  cv: user.cv,
  bio: user.bio,
  industry: user.industry,
  companySize: user.companySize,
  linkedIn: user.linkedIn,
  portfolio: user.portfolio,
});

// ─── Register Student ─────────────────────────────────────────────────────────
exports.registerStudent = asyncHandler(async (req, res) => {
  const { fullName, email, password, university, department, yearOfStudy } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ success: false, message: 'fullName, email and password are required' });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ success: false, message: 'Email already registered' });

  const student = await Student.create({ fullName, email, password, university, department, yearOfStudy });
  try { await sendWelcomeEmail(email, fullName); } catch (_) {}

  await sendTokens(student, res, 201);
});

// ─── Register Employer ────────────────────────────────────────────────────────
exports.registerEmployer = asyncHandler(async (req, res) => {
  const { companyName, contactPersonName, email, password, industry, companySize, website } = req.body;
  if (!companyName || !contactPersonName || !email || !password) {
    return res.status(400).json({ success: false, message: 'Required fields missing' });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ success: false, message: 'Email already registered' });

  const employer = await Employer.create({ companyName, contactPersonName, email, password, industry, companySize, website });
  try { await sendWelcomeEmail(email, companyName); } catch (_) {}

  await sendTokens(employer, res, 201);
});

// ─── Login ────────────────────────────────────────────────────────────────────
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  if (!user.isActive) {
    return res.status(403).json({ success: false, message: 'Account suspended' });
  }

  await sendTokens(user, res);
});

// ─── Refresh Token ────────────────────────────────────────────────────────────
exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ success: false, message: 'Refresh token required' });

  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.id).select('+refreshToken');

  if (!user || user.refreshToken !== refreshToken) {
    return res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }

  await sendTokens(user, res);
});

// ─── Logout ───────────────────────────────────────────────────────────────────
exports.logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// ─── Forgot Password (send OTP) ───────────────────────────────────────────────
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Always respond 200 to avoid email enumeration
  if (!user) return res.status(200).json({ success: true, message: 'If that email exists, a code was sent' });

  const { otp, expires } = generateOtp();
  user.resetOtp = otp;
  user.resetOtpExpires = expires;
  await user.save({ validateBeforeSave: false });

  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({ success: false, message: 'Failed to send email' });
  }

  res.status(200).json({ success: true, message: 'OTP sent to your email' });
});

// ─── Verify OTP ───────────────────────────────────────────────────────────────
exports.verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email }).select('+resetOtp +resetOtpExpires');

  if (!user || user.resetOtp !== otp || user.resetOtpExpires < Date.now()) {
    return res.status(400).json({ success: false, message: 'Invalid or expired code' });
  }

  res.status(200).json({ success: true, message: 'OTP verified' });
});

// ─── Reset Password ───────────────────────────────────────────────────────────
exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email }).select('+resetOtp +resetOtpExpires +password');

  if (!user || user.resetOtp !== otp || user.resetOtpExpires < Date.now()) {
    return res.status(400).json({ success: false, message: 'Invalid or expired code' });
  }

  user.password = newPassword;
  user.resetOtp = undefined;
  user.resetOtpExpires = undefined;
  await user.save();

  res.status(200).json({ success: true, message: 'Password reset successful' });
});

// ─── Change Password (Authenticated) ──────────────────────────────────────────
exports.changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Old and new passwords are required' });
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(oldPassword))) {
    return res.status(401).json({ success: false, message: 'Incorrect old password' });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true, message: 'Password changed successfully' });
});
