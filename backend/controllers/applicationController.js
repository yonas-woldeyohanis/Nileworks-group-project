const { Application, Notification } = require('../models/index');
const Job = require('../models/Job');
const { asyncHandler } = require('../middleware/errorHandler');
const { uploadDocument } = require('../config/cloudinary');

// ─── POST /jobs/:jobId/apply ──────────────────────────────────────────────────
exports.apply = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const { coverLetter } = req.body;

  const job = await Job.findById(jobId);
  if (!job || !job.isActive) {
    return res.status(404).json({ success: false, message: 'Job not found or inactive' });
  }

  const existing = await Application.findOne({ job: jobId, student: req.user._id });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Already applied to this job' });
  }

  const application = await Application.create({
    job: jobId,
    student: req.user._id,
    employer: job.employer,
    coverLetter: coverLetter || null,
    cv: req.file?.path || req.user.cv || null,
  });

  // Increment applicants count
  await Job.findByIdAndUpdate(jobId, { $inc: { applicantsCount: 1 } });

  // Notify employer
  await Notification.create({
    recipient: job.employer,
    type: 'job_match',
    title: 'New Application',
    message: `${req.user.fullName} applied for ${job.title}`,
    applicationId: application._id,
    jobId: job._id,
  });

  await application.populate([
    { path: 'job', populate: { path: 'employer', select: 'companyName logo' } },
    { path: 'student', select: 'fullName avatar university department yearOfStudy' },
  ]);

  res.status(201).json({ success: true, data: application });
});

// ─── GET /applications/my ─────────────────────────────────────────────────────
exports.getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ student: req.user._id })
    .sort({ createdAt: -1 })
    .populate({ path: 'job', populate: { path: 'employer', select: 'companyName logo' } });

  res.status(200).json({ success: true, data: applications });
});

// ─── GET /jobs/:jobId/applicants (employer) ───────────────────────────────────
exports.getJobApplicants = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.jobId, employer: req.user._id });
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

  const applications = await Application.find({ job: req.params.jobId })
    .sort({ createdAt: -1 })
    .populate('student', 'fullName avatar university department yearOfStudy skills cv bio');

  res.status(200).json({ success: true, data: applications });
});

// ─── GET /applications/employer (employer) ────────────────────────────────────
exports.getAllEmployerApplicants = asyncHandler(async (req, res) => {
  const applications = await Application.find({ employer: req.user._id })
    .sort({ createdAt: -1 })
    .populate('student', 'fullName avatar university department yearOfStudy skills cv bio')
    .populate('job', 'title');

  res.status(200).json({ success: true, data: applications });
});

// ─── PATCH /applications/:id/status (employer) ────────────────────────────────
exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['viewed', 'shortlisted', 'interview', 'offered', 'rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  const application = await Application.findOne({ _id: req.params.id, employer: req.user._id });
  if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

  application.status = status;
  await application.save();

  // Notify student
  const notifMessages = {
    viewed: 'Your application has been viewed',
    shortlisted: 'You have been shortlisted! 🌟',
    interview: 'You have been invited for an interview! 🎉',
    offered: 'Congratulations! You have received a job offer! 🏆',
    rejected: 'Your application status has been updated',
  };

  const notifTypes = {
    viewed: 'application_viewed', shortlisted: 'shortlisted',
    interview: 'interview', offered: 'offer', rejected: 'rejected',
  };

  await Notification.create({
    recipient: application.student,
    type: notifTypes[status],
    title: notifMessages[status],
    message: `Update for your application`,
    applicationId: application._id,
  });

  res.status(200).json({ success: true, data: application });
});
