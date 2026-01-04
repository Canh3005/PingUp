import express from 'express';
import devlogController from '../controllers/devlogController.js';
import auth from '../middlewares/auth.js';
import { checkDevlogPermission } from '../middlewares/resourcePermission.js';

const router = express.Router();

// Devlog CRUD (members can create/update their own devlogs)
router.post('/', auth, devlogController.createDevlog);
router.get('/:id', auth, devlogController.getDevlog);
router.put('/:id', auth, checkDevlogPermission('update'), devlogController.updateDevlog);
router.delete('/:id', auth, checkDevlogPermission('delete'), devlogController.deleteDevlog);

// Get devlogs (authenticated)
router.get('/project/:projectHubId', auth, devlogController.getDevlogsByProjectHub);
router.get('/project/:projectHubId/recent', auth, devlogController.getRecentDevlogs);
router.get('/project/:projectHubId/date-range', auth, devlogController.getDevlogsByDateRange);

// Reactions (authenticated users can react)
router.post('/:id/reactions', auth, devlogController.addReaction);
router.delete('/:id/reactions', auth, devlogController.removeReaction);

// Pin/Unpin (owner or admin only) - will be checked in service
router.put('/:id/pin', auth, devlogController.togglePin);

export default router;
