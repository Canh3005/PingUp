import express from 'express';
import projectHubController from '../controllers/projectHubController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Create new project hub (authenticated)
router.post('/', auth, projectHubController.createProjectHub);

// Get user's project hubs (authenticated)
router.get('/my-hubs', auth, projectHubController.getUserProjectHubs);

// Get all project hubs (public)
router.get('/', projectHubController.getAllProjectHubs);

// Get project hub by ID
router.get('/:hubId', projectHubController.getProjectHub);

// Update project hub (authenticated)
router.put('/:hubId', auth, projectHubController.updateProjectHub);

// Delete project hub (authenticated)
router.delete('/:hubId', auth, projectHubController.deleteProjectHub);

// Add member to project hub (authenticated)
router.post('/:hubId/members', auth, projectHubController.addMember);

// Remove member from project hub (authenticated)
router.delete('/:hubId/members/:userId', auth, projectHubController.removeMember);

// Update member role (authenticated)
router.put('/:hubId/members/:userId', auth, projectHubController.updateMemberRole);

// Link showcase project (authenticated)
router.put('/:hubId/showcase', auth, projectHubController.linkShowcaseProject);

// Update integrations (authenticated)
router.put('/:hubId/integrations', auth, projectHubController.updateIntegrations);

export default router;
