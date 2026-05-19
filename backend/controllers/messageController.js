const { Conversation, Message } = require('../models/index');
const { asyncHandler } = require('../middleware/errorHandler');

// ─── GET /messages/conversations ─────────────────────────────────────────────
exports.getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .sort({ lastMessageAt: -1 })
    .populate('participants', 'fullName companyName avatar logo role');

  const enriched = conversations.map((c) => ({
    ...c.toObject(),
    currentUserId: req.user._id,
    unreadCount: c.unreadCounts?.get(req.user._id.toString()) || 0,
  }));

  res.status(200).json({ success: true, data: enriched });
});

// ─── GET /messages/conversations/:id ─────────────────────────────────────────
exports.getConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({
    _id: req.params.id,
    participants: req.user._id,
  }).populate('participants', 'fullName companyName avatar logo role');

  if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found' });

  const messages = await Message.find({ conversation: req.params.id })
    .sort({ createdAt: 1 })
    .populate('sender', 'fullName companyName avatar');

  // Mark as read
  await Conversation.findByIdAndUpdate(req.params.id, {
    $set: { [`unreadCounts.${req.user._id}`]: 0 },
  });

  res.status(200).json({ success: true, data: { ...conversation.toObject(), messages } });
});

// ─── POST /messages/start ─────────────────────────────────────────────────────
exports.startConversation = asyncHandler(async (req, res) => {
  const { recipientId } = req.body;

  // Check if conversation already exists
  let conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, recipientId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user._id, recipientId],
    });
  }

  await conversation.populate('participants', 'fullName companyName avatar logo role');
  res.status(200).json({ success: true, data: conversation });
});

// ─── POST /messages/conversations/:id/send ────────────────────────────────────
exports.sendMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const conversation = await Conversation.findOne({
    _id: req.params.id,
    participants: req.user._id,
  });

  if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found' });

  const message = await Message.create({
    conversation: req.params.id,
    sender: req.user._id,
    content,
    readBy: [req.user._id],
  });

  // Update conversation last message + unread counts for others
  const otherParticipants = conversation.participants.filter(
    (p) => p.toString() !== req.user._id.toString()
  );

  const unreadUpdate = {};
  otherParticipants.forEach((p) => {
    const current = conversation.unreadCounts?.get(p.toString()) || 0;
    unreadUpdate[`unreadCounts.${p}`] = current + 1;
  });

  await Conversation.findByIdAndUpdate(req.params.id, {
    lastMessage: content,
    lastMessageAt: new Date(),
    $set: unreadUpdate,
  });

  await message.populate('sender', 'fullName companyName avatar');

  // Emit via socket (accessed via req.app)
  const io = req.app.get('io');
  if (io) {
    io.to(req.params.id).emit('new_message', message);
  }

  res.status(201).json({ success: true, data: message });
});
