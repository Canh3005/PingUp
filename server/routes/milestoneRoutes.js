import express from 'express';
import milestoneController from '../controllers/milestoneController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Create new milestone (authenticated)
router.post('/', auth, milestoneController.createMilestone);

// Get milestones by project hub ID
router.get('/project/:hubId', milestoneController.getMilestonesByProject);

// Get milestone by ID
router.get('/:milestoneId', milestoneController.getMilestone);

// Update milestone (authenticated)
router.put('/:milestoneId', auth, milestoneController.updateMilestone);

// Update milestone status (authenticated)
router.put('/:milestoneId/status', auth, milestoneController.updateMilestoneStatus);

// Delete milestone (authenticated)
router.delete('/:milestoneId', auth, milestoneController.deleteMilestone);

// Recalculate milestone progress
router.post('/:milestoneId/recalculate-progress', auth, milestoneController.recalculateProgress);

export default router;
