const express = require('express');
const profileCtrl = require('../controllers/profileController');
const appCtrl = require('../controllers/applicationController');
const msgCtrl = require('../controllers/messageController');
const notifCtrl = require('../controllers/notificationController');
const { protect, requireRole } = require('../middleware/auth');
const { uploadImage, uploadDocument } = require('../config/cloudinary');

// ─── Students ─────────────────────────────────────────────────────────────────
const studentRouter = express.Router();
studentRouter.use(protect, requireRole('student'));
studentRouter.get('/profile', profileCtrl.getStudentProfile);
studentRouter.patch('/profile', profileCtrl.updateStudentProfile);
studentRouter.patch('/profile/avatar', uploadImage.single('avatar'), profileCtrl.uploadStudentAvatar);
studentRouter.patch('/profile/cv', uploadDocument.single('cv'), profileCtrl.uploadStudentCV);

// ─── Employers ────────────────────────────────────────────────────────────────
const employerRouter = express.Router();
employerRouter.use(protect, requireRole('employer'));
employerRouter.get('/profile', profileCtrl.getEmployerProfile);
employerRouter.patch('/profile', profileCtrl.updateEmployerProfile);
employerRouter.patch('/profile/logo', uploadImage.single('logo'), profileCtrl.uploadEmployerLogo);
employerRouter.get('/analytics', profileCtrl.getEmployerAnalytics);

// ─── Applications ─────────────────────────────────────────────────────────────
const appRouter = express.Router();
appRouter.use(protect);
appRouter.get('/my', requireRole('student'), appCtrl.getMyApplications);
appRouter.get('/employer', requireRole('employer'), appCtrl.getAllEmployerApplicants);
appRouter.patch('/:id/status', requireRole('employer'), appCtrl.updateStatus);

// ─── Messages ─────────────────────────────────────────────────────────────────
const msgRouter = express.Router();
msgRouter.use(protect);
msgRouter.get('/conversations', msgCtrl.getConversations);
msgRouter.get('/conversations/:id', msgCtrl.getConversation);
msgRouter.post('/conversations/:id/send', msgCtrl.sendMessage);
msgRouter.post('/start', msgCtrl.startConversation);

// ─── Notifications ────────────────────────────────────────────────────────────
const notifRouter = express.Router();
notifRouter.use(protect);
notifRouter.get('/', notifCtrl.getNotifications);
notifRouter.patch('/:id/read', notifCtrl.markRead);
notifRouter.patch('/read-all', notifCtrl.markAllRead);
notifRouter.post('/register-token', notifCtrl.registerPushToken);

module.exports = { studentRouter, employerRouter, appRouter, msgRouter, notifRouter };
