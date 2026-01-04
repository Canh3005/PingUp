import express from 'express';
import hubActivityController from '../controllers/hubActivityController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Get activities (authenticated users - may need member check in service layer)
router.get('/project/:projectHubId', auth, hubActivityController.getActivitiesWithPagination);
router.get('/project/:projectHubId/recent', auth, hubActivityController.getRecentActivities);
router.get('/project/:projectHubId/type/:activityType', auth, hubActivityController.getActivitiesByType);
router.get('/project/:projectHubId/user/:userId', auth, hubActivityController.getUserActivities);
router.get('/project/:projectHubId/timeline', auth, hubActivityController.getTimeline);

// Statistics (authenticated users - may need member check in service layer)
router.get('/project/:projectHubId/statistics', auth, hubActivityController.getActivityStatistics);

export default router;
