import express from 'express';
import taskController from '../controllers/taskController.js';
import auth from '../middlewares/auth.js';
import { checkTaskPermission } from '../middlewares/resourcePermission.js';

const router = express.Router();

// Task CRUD (members can create/update tasks)
router.post('/', auth, taskController.createTask);
router.get('/:id', auth, taskController.getTask);
router.put('/:id', auth, checkTaskPermission('update'), taskController.updateTask);
router.delete('/:id', auth, checkTaskPermission('delete'), taskController.deleteTask);

// Get tasks (authenticated)
router.get('/project/:projectHubId', auth, taskController.getTasksByProjectHub);
router.get('/milestone/:milestoneId', auth, taskController.getTasksByMilestone);

// Task actions (members can perform these actions)
router.put('/:id/move', auth, checkTaskPermission('update'), taskController.moveTask);
router.put('/:id/assign', auth, checkTaskPermission('update'), taskController.assignUser);
router.put('/:id/unassign', auth, checkTaskPermission('update'), taskController.unassignUser);

// Attachments (members can add/remove attachments)
router.post('/:id/attachments', auth, checkTaskPermission('update'), taskController.addAttachment);
router.delete('/:id/attachments/:attachmentId', auth, checkTaskPermission('update'), taskController.removeAttachment);

// Labels (members can manage labels)
router.post('/:id/labels', auth, checkTaskPermission('update'), taskController.addLabel);
router.delete('/:id/labels', auth, checkTaskPermission('update'), taskController.removeLabel);
router.get('/labels/available', auth, taskController.getAvailableLabels);

// Statistics (authenticated)
router.get('/project/:projectHubId/statistics', auth, taskController.getTaskStatistics);

export default router;
