const { Student, Employer } = require('../models/User');
const Job = require('../models/Job');
const { Application } = require('../models/index');
const { asyncHandler } = require('../middleware/errorHandler');

// ─── GET /students/profile ────────────────────────────────────────────────────
exports.getStudentProfile = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.user._id);
  res.status(200).json({ success: true, data: student });
});

// ─── PATCH /students/profile ──────────────────────────────────────────────────
exports.updateStudentProfile = asyncHandler(async (req, res) => {
  const allowed = ['bio', 'skills', 'linkedIn', 'portfolio', 'gpaRange'];
  const updates = {};
  allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  const student = await Student.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: student });
});

// ─── PATCH /students/profile/avatar ──────────────────────────────────────────
exports.uploadStudentAvatar = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const student = await Student.findByIdAndUpdate(
    req.user._id,
    { avatar: req.file.path },
    { new: true }
  );
  res.status(200).json({ success: true, data: { avatar: student.avatar } });
});

// ─── PATCH /students/profile/cv ───────────────────────────────────────────────
exports.uploadStudentCV = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const student = await Student.findByIdAndUpdate(
    req.user._id,
    { cv: req.file.path },
    { new: true }
  );
  res.status(200).json({ success: true, data: { cv: student.cv } });
});

// ─── GET /employers/profile ───────────────────────────────────────────────────
exports.getEmployerProfile = asyncHandler(async (req, res) => {
  const employer = await Employer.findById(req.user._id);
  res.status(200).json({ success: true, data: employer });
});

// ─── PATCH /employers/profile ─────────────────────────────────────────────────
exports.updateEmployerProfile = asyncHandler(async (req, res) => {
  const allowed = ['companyDescription', 'website', 'linkedIn', 'headquarters'];
  const updates = {};
  allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  const employer = await Employer.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.status(200).json({ success: true, data: employer });
});

// ─── PATCH /employers/profile/logo ───────────────────────────────────────────
exports.uploadEmployerLogo = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const employer = await Employer.findByIdAndUpdate(
    req.user._id,
    { logo: req.file.path },
    { new: true }
  );
  res.status(200).json({ success: true, data: { logo: employer.logo } });
});

// ─── GET /employers/analytics ─────────────────────────────────────────────────
exports.getEmployerAnalytics = asyncHandler(async (req, res) => {
  const [totalJobs, jobIds] = await Promise.all([
    Job.countDocuments({ employer: req.user._id, isActive: true }),
    Job.find({ employer: req.user._id }).select('_id'),
  ]);

  const ids = jobIds.map((j) => j._id);

  const [totalApplicants, shortlisted, offers] = await Promise.all([
    Application.countDocuments({ employer: req.user._id }),
    Application.countDocuments({ employer: req.user._id, status: 'shortlisted' }),
    Application.countDocuments({ employer: req.user._id, status: 'offered' }),
  ]);

  res.status(200).json({
    success: true,
    data: { totalJobs, totalApplicants, shortlisted, offers },
  });
});
