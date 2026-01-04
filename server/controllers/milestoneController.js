import milestoneService from '../services/milestoneService.js';

class MilestoneController {
  // Create new milestone
  async createMilestone(req, res) {
    try {
      const userId = req.user.profile._id.toString();
      const milestoneData = req.body;

      const milestone = await milestoneService.createMilestone(userId, milestoneData);

      res.status(201).json({
        success: true,
        message: 'Milestone created successfully',
        data: milestone,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get milestone by ID
  async getMilestone(req, res) {
    try {
      const { milestoneId } = req.params;

      const milestone = await milestoneService.getMilestoneById(milestoneId);

      res.status(200).json({
        success: true,
        data: milestone,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get milestones by project hub ID
  async getMilestonesByProject(req, res) {
    try {
      const { hubId } = req.params;
      const { status } = req.query;

      const milestones = await milestoneService.getMilestonesByProject(hubId, status);

      res.status(200).json({
        success: true,
        data: milestones,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update milestone
  async updateMilestone(req, res) {
    try {
      const { milestoneId } = req.params;
      const userId = req.user.profile._id.toString();
      const updateData = req.body;

      const milestone = await milestoneService.updateMilestone(
        milestoneId,
        userId,
        updateData
      );

      res.status(200).json({
        success: true,
        message: 'Milestone updated successfully',
        data: milestone,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update milestone status
  async updateMilestoneStatus(req, res) {
    try {
      const { milestoneId } = req.params;
      const userId = req.user.profile._id.toString();
      const { status } = req.body;

      const milestone = await milestoneService.updateMilestoneStatus(
        milestoneId,
        userId,
        status
      );

      res.status(200).json({
        success: true,
        message: 'Milestone status updated successfully',
        data: milestone,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete milestone
  async deleteMilestone(req, res) {
    try {
      const { milestoneId } = req.params;
      const userId = req.user.profile._id.toString();

      await milestoneService.deleteMilestone(milestoneId, userId);

      res.status(200).json({
        success: true,
        message: 'Milestone deleted successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Recalculate milestone progress
  async recalculateProgress(req, res) {
    try {
      const { milestoneId } = req.params;

      const milestone = await milestoneService.recalculateMilestoneProgress(milestoneId);

      res.status(200).json({
        success: true,
        message: 'Milestone progress recalculated successfully',
        data: milestone,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new MilestoneController();
