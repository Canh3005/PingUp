import express from 'express';
import profileController from '../controllers/profileController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// GET /api/profile - Get user profile
router.get('/', auth, profileController.getProfile);

// POST /api/profile - Update user profile
router.post('/', auth, profileController.updateProfile);

// Experience routes
router.post('/experience', auth, profileController.addExperience);
router.put('/experience/:experienceId', auth, profileController.updateExperience);
router.delete('/experience/:experienceId', auth, profileController.deleteExperience);

// Education routes
router.post('/education', auth, profileController.addEducation);
router.put('/education/:educationId', auth, profileController.updateEducation);
router.delete('/education/:educationId', auth, profileController.deleteEducation);

export default router;
