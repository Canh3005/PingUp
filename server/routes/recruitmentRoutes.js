import express from 'express';
import recruitmentController from '../controllers/recruitmentController.js';
import auth from '../middlewares/auth.js';
import { checkIsAdminOrOwner } from '../middlewares/projectHubAuth.js';
import { checkRecruitmentPermission } from '../middlewares/resourcePermission.js';

const router = express.Router();

// Create recruitment (owner or admin only) - hubId from body.projectHub
router.post('/', auth, recruitmentController.createRecruitment);

// Get recruitments by project hub (authenticated users)
router.get('/project-hub/:projectHubId', auth, recruitmentController.getRecruitmentsByProjectHub);

// Get recruitment by ID (authenticated users)
router.get('/:id', auth, recruitmentController.getRecruitmentById);

// Update recruitment (owner or admin only)
router.put('/:id', auth, checkRecruitmentPermission('update'), recruitmentController.updateRecruitment);

// Close recruitment (owner or admin only)
router.patch('/:id/close', auth, checkRecruitmentPermission('update'), recruitmentController.closeRecruitment);

// Delete recruitment (owner or admin only)
router.delete('/:id', auth, checkRecruitmentPermission('delete'), recruitmentController.deleteRecruitment);

export default router;
