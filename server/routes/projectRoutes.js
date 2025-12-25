import express from 'express';
import projectController from '../controllers/projectController.js';
import auth  from '../middlewares/auth.js';

const router = express.Router();

// Create new project (authenticated)
router.post('/', auth, projectController.createProject);

// Get user's projects (authenticated)
router.get('/my-projects', auth, projectController.getUserProjects);

// Get published projects (public feed)
router.get('/published', projectController.getPublishedProjects);

// Get projects from followed users (authenticated)
router.get('/following', auth, projectController.getFollowingProjects);

// Get user's published projects by userId (public)
router.get('/user/:userId/published', projectController.getUserPublishedProjects);

// Get project by ID
router.get('/:projectId', projectController.getProject);

// Update project (authenticated)
router.put('/:projectId', auth, projectController.updateProject);

// Update project blocks (authenticated)
router.put('/:projectId/blocks', auth, projectController.updateBlocks);

// Update project styles (authenticated)
router.put('/:projectId/styles', auth, projectController.updateStyles);

// Publish project (authenticated)
router.post('/:projectId/publish', auth, projectController.publishProject);

// Delete project (authenticated)
router.delete('/:projectId', auth, projectController.deleteProject);

// Toggle like (authenticated)
router.post('/:projectId/like', auth, projectController.toggleLike);

// Increment view count (public)
router.post('/:projectId/view', projectController.incrementView);

export default router;
