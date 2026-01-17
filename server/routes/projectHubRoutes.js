import express from 'express';
import projectHubController from '../controllers/projectHubController.js';
import auth from '../middlewares/auth.js';
import { 
  checkIsMember, 
  checkIsAdminOrOwner, 
  checkIsOwner 
} from '../middlewares/projectHubAuth.js';

const router = express.Router();

// Create new project hub (authenticated)
router.post('/', auth, projectHubController.createProjectHub);

// Get user's project hubs (authenticated)
router.get('/my-hubs', auth, projectHubController.getUserProjectHubs);

// Get all project hubs (public)
router.get('/', projectHubController.getAllProjectHubs);

// Get project hub by ID (TODO: optionalAuth - works for both authenticated and unauthenticated users)
router.get('/:hubId', auth, projectHubController.getProjectHub);

// Update project hub (owner or admin only)
router.put('/:hubId', auth, checkIsAdminOrOwner, projectHubController.updateProjectHub);

// Delete project hub (owner only)
router.delete('/:hubId', auth, checkIsOwner, projectHubController.deleteProjectHub);

// Add member to project hub (owner or admin only)
router.post('/:hubId/members', auth, checkIsAdminOrOwner, projectHubController.addMember);

// Remove member from project hub (owner or admin only)
router.delete('/:hubId/members/:userId', auth, checkIsAdminOrOwner, projectHubController.removeMember);

// Update member role (owner only)
router.put('/:hubId/members/:userId', auth, checkIsOwner, projectHubController.updateMemberRole);

// Link showcase project (owner or admin only)
router.put('/:hubId/showcase', auth, checkIsAdminOrOwner, projectHubController.linkShowcaseProject);

// Update integrations (owner or admin only)
router.put('/:hubId/integrations', auth, checkIsAdminOrOwner, projectHubController.updateIntegrations);

export default router;
