import applicationService from '../services/applicationService.js';

class ApplicationController {
  // Create new application
  async createApplication(req, res) {
    try {
      const userId = req.user.profile._id;
      const applicationData = req.body;

      const application = await applicationService.createApplication(userId, applicationData);

      res.status(201).json({
        success: true,
        data: application,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get application by ID
  async getApplicationById(req, res) {
    try {
      const { id } = req.params;

      const application = await applicationService.getApplicationById(id);

      res.status(200).json({
        success: true,
        data: application,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get applications by recruitment
  async getApplicationsByRecruitment(req, res) {
    try {
      const { recruitmentId } = req.params;
      const { status } = req.query;

      const applications = await applicationService.getApplicationsByRecruitment(
        recruitmentId,
        { status }
      );

      res.status(200).json({
        success: true,
        data: applications,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get user's applications
  async getMyApplications(req, res) {
    try {
      const userId = req.user.profile._id;

      const applications = await applicationService.getApplicationsByUser(userId);

      res.status(200).json({
        success: true,
        data: applications,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update application status
  async updateApplicationStatus(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.profile._id;
      const { status, reviewNotes } = req.body;

      const application = await applicationService.updateApplicationStatus(
        id,
        userId,
        status,
        reviewNotes
      );

      res.status(200).json({
        success: true,
        data: application,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Withdraw application
  async withdrawApplication(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.profile._id;

      const result = await applicationService.withdrawApplication(id, userId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get application stats for a recruitment
  async getApplicationStats(req, res) {
    try {
      const { recruitmentId } = req.params;

      const stats = await applicationService.getApplicationStats(recruitmentId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new ApplicationController();
