import express from 'express';
import applicationController from '../controllers/applicationController.js';
import auth from '../middlewares/auth.js';
import { checkCanReviewApplication } from '../middlewares/resourcePermission.js';

const router = express.Router();

// Create application (any authenticated user can apply)
router.post('/', auth, applicationController.createApplication);

// Get user's own applications (authenticated)
router.get('/my-applications', auth, applicationController.getMyApplications);

// Get applications by recruitment (owner or admin of the project hub)
router.get('/recruitment/:recruitmentId', auth, applicationController.getApplicationsByRecruitment);

// Get application stats (owner or admin only)
router.get('/recruitment/:recruitmentId/stats', auth, applicationController.getApplicationStats);

// Get application by ID (authenticated)
router.get('/:id', auth, applicationController.getApplicationById);

// Update application status - review (owner or admin only)
router.patch('/:id/status', auth, checkCanReviewApplication, applicationController.updateApplicationStatus);

// Withdraw application (applicant can withdraw their own)
router.delete('/:id', auth, applicationController.withdrawApplication);

export default router;
