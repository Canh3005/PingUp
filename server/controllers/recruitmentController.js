import recruitmentService from '../services/recruitmentService.js';

class RecruitmentController {
  // Create new recruitment
  async createRecruitment(req, res) {
    try {
      const userId = req.user.profile._id;
      const recruitmentData = req.body;

      const recruitment = await recruitmentService.createRecruitment(userId, recruitmentData);

      res.status(201).json({
        success: true,
        data: recruitment,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get recruitment by ID
  async getRecruitmentById(req, res) {
    try {
      const { id } = req.params;

      const recruitment = await recruitmentService.getRecruitmentById(id);

      res.status(200).json({
        success: true,
        data: recruitment,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get recruitments by project hub
  async getRecruitmentsByProjectHub(req, res) {
    try {
      const { projectHubId } = req.params;
      const { status } = req.query;

      const recruitments = await recruitmentService.getRecruitmentsByProjectHub(
        projectHubId,
        { status }
      );

      res.status(200).json({
        success: true,
        data: recruitments,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update recruitment
  async updateRecruitment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.profile._id;
      const updateData = req.body;

      const recruitment = await recruitmentService.updateRecruitment(id, userId, updateData);

      res.status(200).json({
        success: true,
        data: recruitment,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Close recruitment
  async closeRecruitment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.profile._id;
      const { filledBy } = req.body;

      const recruitment = await recruitmentService.closeRecruitment(id, userId, filledBy);

      res.status(200).json({
        success: true,
        data: recruitment,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete recruitment
  async deleteRecruitment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.profile._id;

      const result = await recruitmentService.deleteRecruitment(id, userId);

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
}

export default new RecruitmentController();
