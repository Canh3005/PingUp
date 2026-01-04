import express from 'express';
import recruitmentController from '../controllers/recruitmentController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Create recruitment
router.post('/', auth, recruitmentController.createRecruitment);

// Get recruitments by project hub
router.get('/project-hub/:projectHubId', auth, recruitmentController.getRecruitmentsByProjectHub);

// Get recruitment by ID
router.get('/:id', auth, recruitmentController.getRecruitmentById);

// Update recruitment
router.put('/:id', auth, recruitmentController.updateRecruitment);

// Close recruitment
router.patch('/:id/close', auth, recruitmentController.closeRecruitment);

// Delete recruitment
router.delete('/:id', auth, recruitmentController.deleteRecruitment);

export default router;
