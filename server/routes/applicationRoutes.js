import express from 'express';
import applicationController from '../controllers/applicationController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Create application
router.post('/', auth, applicationController.createApplication);

// Get user's own applications
router.get('/my-applications', auth, applicationController.getMyApplications);

// Get applications by recruitment
router.get('/recruitment/:recruitmentId', auth, applicationController.getApplicationsByRecruitment);

// Get application stats
router.get('/recruitment/:recruitmentId/stats', auth, applicationController.getApplicationStats);

// Get application by ID
router.get('/:id', auth, applicationController.getApplicationById);

// Update application status (review)
router.patch('/:id/status', auth, applicationController.updateApplicationStatus);

// Withdraw application
router.delete('/:id', auth, applicationController.withdrawApplication);

export default router;
