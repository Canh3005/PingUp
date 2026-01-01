import express from 'express';
import devlogController from '../controllers/devlogController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Devlog CRUD
router.post('/', auth, devlogController.createDevlog);
router.get('/:id', auth, devlogController.getDevlog);
router.put('/:id', auth, devlogController.updateDevlog);
router.delete('/:id', auth, devlogController.deleteDevlog);

// Get devlogs
router.get('/project/:projectHubId', auth, devlogController.getDevlogsByProjectHub);
router.get('/project/:projectHubId/recent', auth, devlogController.getRecentDevlogs);
router.get('/project/:projectHubId/date-range', auth, devlogController.getDevlogsByDateRange);

// Reactions
router.post('/:id/reactions', auth, devlogController.addReaction);
router.delete('/:id/reactions', auth, devlogController.removeReaction);

// Pin/Unpin
router.put('/:id/pin', auth, devlogController.togglePin);

export default router;
