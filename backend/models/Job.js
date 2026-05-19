const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, minlength: 50 },
    jobType: {
      type: String,
      enum: ['internship', 'part-time', 'full-time', 'remote'],
      required: true,
    },
    location: { type: String, required: true },
    salary: { type: String, default: null },        // free-form e.g. "5,000 ETB/month"
    openings: { type: Number, default: 1, min: 1 },
    deadline: { type: Date, required: true },
    skills: [{ type: String, trim: true }],
    industry: { type: String, default: null },
    isPaid: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    applicantsCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index for search
jobSchema.index({ title: 'text', description: 'text', location: 'text' });
jobSchema.index({ jobType: 1, isActive: 1, deadline: 1 });
jobSchema.index({ employer: 1 });

module.exports = mongoose.model('Job', jobSchema);
