const mongoose = require('mongoose');

// ─── Application ──────────────────────────────────────────────────────────────
const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coverLetter: { type: String, default: null },
    cv: { type: String, default: null },            // Cloudinary URL (optional override)
    status: {
      type: String,
      enum: ['applied', 'viewed', 'shortlisted', 'interview', 'offered', 'rejected'],
      default: 'applied',
    },
    employerNotes: { type: String, default: null, select: false },
  },
  { timestamps: true }
);

applicationSchema.index({ student: 1, job: 1 }, { unique: true });
applicationSchema.index({ employer: 1, status: 1 });

const Application = mongoose.model('Application', applicationSchema);

// ─── Conversation ─────────────────────────────────────────────────────────────
const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: { type: String, default: null },
    lastMessageAt: { type: Date, default: Date.now },
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

// ─── Message ──────────────────────────────────────────────────────────────────
const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 2000 },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

messageSchema.index({ conversation: 1, createdAt: 1 });

const Message = mongoose.model('Message', messageSchema);

// ─── Notification ─────────────────────────────────────────────────────────────
const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['application_viewed', 'shortlisted', 'interview', 'offer', 'rejected', 'message', 'job_match'],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', default: null },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', default: null },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = { Application, Conversation, Message, Notification };
