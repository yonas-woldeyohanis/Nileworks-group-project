// ─── routes/auth.js ───────────────────────────────────────────────────────────
const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register/student', authCtrl.registerStudent);
router.post('/register/employer', authCtrl.registerEmployer);
router.post('/login', authCtrl.login);
router.post('/refresh', authCtrl.refreshToken);
router.post('/logout', protect, authCtrl.logout);
router.post('/forgot-password', authCtrl.forgotPassword);
router.post('/verify-otp', authCtrl.verifyOtp);
router.post('/reset-password', authCtrl.resetPassword);
router.post('/change-password', protect, authCtrl.changePassword);

module.exports = router;
