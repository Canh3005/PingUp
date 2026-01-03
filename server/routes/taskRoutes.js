import express from 'express';
import taskController from '../controllers/taskController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Task CRUD
router.post('/', auth, taskController.createTask);
router.get('/:id', auth, taskController.getTask);
router.put('/:id', auth, taskController.updateTask);
router.delete('/:id', auth, taskController.deleteTask);

// Get tasks
router.get('/project/:projectHubId', auth, taskController.getTasksByProjectHub);
router.get('/milestone/:milestoneId', auth, taskController.getTasksByMilestone);

// Task actions
router.put('/:id/move', auth, taskController.moveTask);
router.put('/:id/assign', auth, taskController.assignUser);
router.put('/:id/unassign', auth, taskController.unassignUser);

// Attachments
router.post('/:id/attachments', auth, taskController.addAttachment);
router.delete('/:id/attachments/:attachmentId', auth, taskController.removeAttachment);

// Labels
router.post('/:id/labels', auth, taskController.addLabel);
router.delete('/:id/labels', auth, taskController.removeLabel);
router.get('/labels/available', auth, taskController.getAvailableLabels);

// Statistics
router.get('/project/:projectHubId/statistics', auth, taskController.getTaskStatistics);

export default router;
