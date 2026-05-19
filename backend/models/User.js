const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const baseOptions = {
  discriminatorKey: 'role',
  timestamps: true,
};

// ─── Base User Schema ─────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    avatar: { type: String, default: null },
    refreshToken: { type: String, select: false },
    resetOtp: { type: String, select: false },
    resetOtpExpires: { type: Date, select: false },
    pushToken: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  baseOptions
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// ─── Student Discriminator ────────────────────────────────────────────────────
const Student = User.discriminator(
  'student',
  new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    university: { type: String, default: null },
    department: { type: String, default: null },
    yearOfStudy: { type: String, default: null },
    bio: { type: String, maxlength: 600, default: null },
    skills: [{ type: String, trim: true }],
    cv: { type: String, default: null },           // Cloudinary URL
    linkedIn: { type: String, default: null },
    portfolio: { type: String, default: null },
    gpaRange: { type: String, default: null },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  })
);

// ─── Employer Discriminator ───────────────────────────────────────────────────
const Employer = User.discriminator(
  'employer',
  new mongoose.Schema({
    companyName: { type: String, required: true, trim: true },
    contactPersonName: { type: String, required: true, trim: true },
    industry: { type: String, default: null },
    companySize: { type: String, default: null },
    companyDescription: { type: String, maxlength: 1000, default: null },
    website: { type: String, default: null },
    linkedIn: { type: String, default: null },
    headquarters: { type: String, default: null },
    logo: { type: String, default: null },          // Cloudinary URL
    isVerified: { type: Boolean, default: false },
  })
);

module.exports = { User, Student, Employer };
