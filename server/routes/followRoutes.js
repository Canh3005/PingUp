import express from 'express';
import auth from '../middlewares/auth.js';
import followController from '../controllers/followController.js';

const router = express.Router();

// Discover users (for People grid)
router.get('/discover', followController.discoverUsers.bind(followController));

// Follow/Unfollow user
router.post('/:userId/follow', auth, followController.followUser.bind(followController));
router.delete('/:userId/unfollow', auth, followController.unfollowUser.bind(followController));

// Get followers/following list
router.get('/:userId/followers', followController.getFollowers.bind(followController));
router.get('/:userId/following', followController.getFollowing.bind(followController));

// Check if current user is following target user
router.get('/:userId/status', auth, followController.checkFollowStatus.bind(followController));

// Search users
router.get('/search', auth, followController.searchUsers.bind(followController));

export default router;
