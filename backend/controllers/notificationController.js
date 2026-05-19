const { Notification } = require('../models/index');
const { User } = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

// ─── GET /notifications ───────────────────────────────────────────────────────
exports.getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.status(200).json({ success: true, data: notifications });
});

// ─── PATCH /notifications/:id/read ───────────────────────────────────────────
exports.markRead = asyncHandler(async (req, res) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { isRead: true }
  );
  res.status(200).json({ success: true, message: 'Marked as read' });
});

// ─── PATCH /notifications/read-all ───────────────────────────────────────────
exports.markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
  res.status(200).json({ success: true, message: 'All notifications marked as read' });
});

// ─── POST /notifications/register-token ──────────────────────────────────────
exports.registerPushToken = asyncHandler(async (req, res) => {
  const { token } = req.body;
  await User.findByIdAndUpdate(req.user._id, { pushToken: token });
  res.status(200).json({ success: true, message: 'Push token registered' });
});
