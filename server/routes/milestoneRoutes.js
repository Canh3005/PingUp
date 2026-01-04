import express from 'express';
import milestoneController from '../controllers/milestoneController.js';
import auth from '../middlewares/auth.js';
import { checkMilestonePermission } from '../middlewares/resourcePermission.js';

const router = express.Router();

// Create new milestone (members can create)
router.post('/', auth, milestoneController.createMilestone);

// Get milestones by project hub ID (public)
router.get('/project/:hubId', milestoneController.getMilestonesByProject);

// Get milestone by ID (public)
router.get('/:milestoneId', milestoneController.getMilestone);

// Update milestone (members can update)
router.put('/:milestoneId', auth, checkMilestonePermission('update'), milestoneController.updateMilestone);

// Update milestone status (members can update status)
router.put('/:milestoneId/status', auth, checkMilestonePermission('update'), milestoneController.updateMilestoneStatus);

// Delete milestone (owner or admin only)
router.delete('/:milestoneId', auth, checkMilestonePermission('delete'), milestoneController.deleteMilestone);

// Recalculate milestone progress (members can recalculate)
router.post('/:milestoneId/recalculate-progress', auth, checkMilestonePermission('update'), milestoneController.recalculateProgress);

export default router;
