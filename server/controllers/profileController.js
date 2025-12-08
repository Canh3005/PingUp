import profileService from '../services/profileService.js';

class ProfileController {
  // GET /api/profile - Get user profile
  async getProfile(req, res) {
    try {
      const userId = req.user._id;
      const profile = await profileService.getProfile(userId);

      return res.status(200).json({
        success: true,
        profile
      });
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get profile',
        error: error.message
      });
    }
  }

  // POST /api/profile - Update user profile
  async updateProfile(req, res) {
    try {
      const userId = req.user._id;
      const profileData = req.body;

      // Validate required fields
      if (!profileData.name || !profileData.jobTitle) {
        return res.status(400).json({
          success: false,
          message: 'Name and job title are required'
        });
      }

      const profile = await profileService.updateProfile(userId, profileData);

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        profile
      });
    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: error.message
      });
    }
  }

  // POST /api/profile/experience - Add experience
  async addExperience(req, res) {
    try {
      const userId = req.user._id;
      const experienceData = req.body;

      if (!experienceData.jobTitle || !experienceData.organization || !experienceData.startYear) {
        return res.status(400).json({
          success: false,
          message: 'Job title, organization, and start year are required'
        });
      }

      const profile = await profileService.addExperience(userId, experienceData);

      return res.status(200).json({
        success: true,
        message: 'Experience added successfully',
        profile
      });
    } catch (error) {
      console.error('Add experience error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to add experience',
        error: error.message
      });
    }
  }

  // PUT /api/profile/experience/:experienceId - Update experience
  async updateExperience(req, res) {
    try {
      const userId = req.user._id;
      const { experienceId } = req.params;
      const experienceData = req.body;

      const profile = await profileService.updateExperience(userId, experienceId, experienceData);

      return res.status(200).json({
        success: true,
        message: 'Experience updated successfully',
        profile
      });
    } catch (error) {
      console.error('Update experience error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to update experience',
        error: error.message
      });
    }
  }

  // DELETE /api/profile/experience/:experienceId - Delete experience
  async deleteExperience(req, res) {
    try {
      const userId = req.user._id;
      const { experienceId } = req.params;

      const profile = await profileService.deleteExperience(userId, experienceId);

      return res.status(200).json({
        success: true,
        message: 'Experience deleted successfully',
        profile
      });
    } catch (error) {
      console.error('Delete experience error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete experience',
        error: error.message
      });
    }
  }

  // POST /api/profile/education - Add education
  async addEducation(req, res) {
    try {
      const userId = req.user._id;
      const educationData = req.body;

      if (!educationData.school || !educationData.degree || !educationData.fieldOfStudy || 
          !educationData.startYear || !educationData.endYear) {
        return res.status(400).json({
          success: false,
          message: 'School, degree, field of study, start year, and end year are required'
        });
      }

      const profile = await profileService.addEducation(userId, educationData);

      return res.status(200).json({
        success: true,
        message: 'Education added successfully',
        profile
      });
    } catch (error) {
      console.error('Add education error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to add education',
        error: error.message
      });
    }
  }

  // PUT /api/profile/education/:educationId - Update education
  async updateEducation(req, res) {
    try {
      const userId = req.user._id;
      const { educationId } = req.params;
      const educationData = req.body;

      const profile = await profileService.updateEducation(userId, educationId, educationData);

      return res.status(200).json({
        success: true,
        message: 'Education updated successfully',
        profile
      });
    } catch (error) {
      console.error('Update education error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to update education',
        error: error.message
      });
    }
  }

  // DELETE /api/profile/education/:educationId - Delete education
  async deleteEducation(req, res) {
    try {
      const userId = req.user._id;
      const { educationId } = req.params;

      const profile = await profileService.deleteEducation(userId, educationId);

      return res.status(200).json({
        success: true,
        message: 'Education deleted successfully',
        profile
      });
    } catch (error) {
      console.error('Delete education error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete education',
        error: error.message
      });
    }
  }
}

export default new ProfileController();
