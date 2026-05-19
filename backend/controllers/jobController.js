const Job = require('../models/Job');
const { Student } = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

// ─── GET /jobs  (list with filters + pagination) ──────────────────────────────
exports.getJobs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, jobType, location, paidOnly, sortBy = 'createdAt' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = { isActive: true, deadline: { $gte: new Date() } };
  if (jobType) filter.jobType = jobType;
  if (location && location !== 'Remote') filter.location = { $regex: location, $options: 'i' };
  if (paidOnly === 'true') filter.isPaid = true;

  const sortOptions = {
    createdAt: { createdAt: -1 },
    deadline: { deadline: 1 },
    relevance: { isFeatured: -1, createdAt: -1 },
  };
  const sort = sortOptions[sortBy] || { createdAt: -1 };

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .sort({ isFeatured: -1, ...sort })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('employer', 'companyName logo industry'),
    Job.countDocuments(filter),
  ]);

  // Mark saved jobs for logged-in student
  let savedJobIds = [];
  if (req.user?.role === 'student') {
    const student = await Student.findById(req.user._id).select('savedJobs');
    savedJobIds = student?.savedJobs?.map((id) => id.toString()) || [];
  }

  const enriched = jobs.map((job) => ({
    ...job.toObject(),
    isSaved: savedJobIds.includes(job._id.toString()),
  }));

  res.status(200).json({
    success: true,
    data: { jobs: enriched, total, page: parseInt(page), hasMore: skip + jobs.length < total },
  });
});

// ─── GET /jobs/search ─────────────────────────────────────────────────────────
exports.searchJobs = asyncHandler(async (req, res) => {
  const { q, jobType, location, paidOnly, sortBy = 'createdAt', page = 1, limit = 10 } = req.query;

  const filter = { isActive: true };
  
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { location: { $regex: q, $options: 'i' } },
      { skills: { $regex: q, $options: 'i' } }
    ];
  }
  
  if (jobType) filter.jobType = { $in: jobType.split(',') };
  if (location) filter.location = { $in: location.split(',') };
  if (paidOnly === 'true') filter.isPaid = true;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  let sort = { createdAt: -1 };
  
  if (sortBy === 'deadline') {
    sort = { deadline: 1 };
  } else if (sortBy === 'relevance' && !q) {
    sort = { isFeatured: -1, createdAt: -1 };
  }

  const jobs = await Job.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .populate('employer', 'companyName logo');

  res.status(200).json({ success: true, data: { jobs, hasMore: jobs.length === parseInt(limit) } });
});

// ─── GET /jobs/:id ────────────────────────────────────────────────────────────
exports.getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('employer', 'companyName logo website industry companySize');
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

  // Increment views
  await Job.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

  let isSaved = false;
  if (req.user?.role === 'student') {
    const student = await Student.findById(req.user._id).select('savedJobs');
    isSaved = student?.savedJobs?.some((id) => id.toString() === job._id.toString()) || false;
  }

  res.status(200).json({ success: true, data: { ...job.toObject(), isSaved } });
});

// ─── POST /jobs  (employer only) ──────────────────────────────────────────────
exports.createJob = asyncHandler(async (req, res) => {
  const { title, description, jobType, location, salary, openings, deadline, skills, isPaid } = req.body;

  const job = await Job.create({
    employer: req.user._id,
    title, description, jobType, location, salary,
    openings: parseInt(openings) || 1,
    deadline: new Date(deadline),
    skills: skills || [],
    isPaid: isPaid !== false,
  });

  await job.populate('employer', 'companyName logo');
  res.status(201).json({ success: true, data: job });
});

// ─── PATCH /jobs/:id  (employer only, own job) ────────────────────────────────
exports.updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, employer: req.user._id });
  if (!job) return res.status(404).json({ success: false, message: 'Job not found or not yours' });

  const allowed = ['title', 'description', 'location', 'salary', 'openings', 'deadline', 'skills', 'isPaid'];
  allowed.forEach((field) => { if (req.body[field] !== undefined) job[field] = req.body[field]; });

  await job.save();
  res.status(200).json({ success: true, data: job });
});

// ─── DELETE /jobs/:id ─────────────────────────────────────────────────────────
exports.deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findOneAndDelete({ _id: req.params.id, employer: req.user._id });
  if (!job) return res.status(404).json({ success: false, message: 'Job not found or not yours' });
  res.status(200).json({ success: true, message: 'Job deleted' });
});

// ─── PATCH /jobs/:id/toggle-status ───────────────────────────────────────────
exports.toggleStatus = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, employer: req.user._id });
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
  job.isActive = !job.isActive;
  await job.save();
  res.status(200).json({ success: true, data: { isActive: job.isActive } });
});

// ─── GET /jobs/my-listings ────────────────────────────────────────────────────
exports.getMyListings = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: jobs });
});

// ─── POST /jobs/:id/save ──────────────────────────────────────────────────────
exports.saveJob = asyncHandler(async (req, res) => {
  await Student.findByIdAndUpdate(req.user._id, { $addToSet: { savedJobs: req.params.id } });
  res.status(200).json({ success: true, message: 'Job saved' });
});

// ─── DELETE /jobs/:id/save ────────────────────────────────────────────────────
exports.unsaveJob = asyncHandler(async (req, res) => {
  await Student.findByIdAndUpdate(req.user._id, { $pull: { savedJobs: req.params.id } });
  res.status(200).json({ success: true, message: 'Job unsaved' });
});

// ─── GET /jobs/saved ──────────────────────────────────────────────────────────
exports.getSavedJobs = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.user._id).select('savedJobs').populate({
    path: 'savedJobs',
    populate: { path: 'employer', select: 'companyName logo' },
  });
  const jobs = (student?.savedJobs || []).map((j) => ({ ...j.toObject(), isSaved: true }));
  res.status(200).json({ success: true, data: { jobs } });
});
