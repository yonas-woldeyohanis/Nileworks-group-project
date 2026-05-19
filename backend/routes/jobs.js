const express = require('express');
const router = express.Router();
const jobCtrl = require('../controllers/jobController');
const appCtrl = require('../controllers/applicationController');
const { protect, requireRole } = require('../middleware/auth');
const { uploadDocument } = require('../config/cloudinary');

// Public-ish (auth optional for saved status)
router.get('/', protect, jobCtrl.getJobs);
router.get('/search', protect, jobCtrl.searchJobs);
router.get('/saved', protect, requireRole('student'), jobCtrl.getSavedJobs);
router.get('/my-listings', protect, requireRole('employer'), jobCtrl.getMyListings);
router.get('/:id', protect, jobCtrl.getJob);

// Student actions
router.post('/:id/save', protect, requireRole('student'), jobCtrl.saveJob);
router.delete('/:id/save', protect, requireRole('student'), jobCtrl.unsaveJob);
router.post('/:jobId/apply', protect, requireRole('student'), uploadDocument.single('cv'), appCtrl.apply);
router.get('/:jobId/applicants', protect, requireRole('employer'), appCtrl.getJobApplicants);

// Employer actions
router.post('/', protect, requireRole('employer'), jobCtrl.createJob);
router.patch('/:id', protect, requireRole('employer'), jobCtrl.updateJob);
router.delete('/:id', protect, requireRole('employer'), jobCtrl.deleteJob);
router.patch('/:id/toggle-status', protect, requireRole('employer'), jobCtrl.toggleStatus);

module.exports = router;
