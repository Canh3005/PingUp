import projectHubService from '../services/projectHubService.js';

class ProjectHubController {
  // Create new project hub
  async createProjectHub(req, res) {
    try {
      const userId = req.user.id;
      const hubData = req.body;

      const projectHub = await projectHubService.createProjectHub(userId, hubData);

      res.status(201).json({
        success: true,
        message: 'Project hub created successfully',
        data: projectHub,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get project hub by ID
  async getProjectHub(req, res) {
    try {
      const { hubId } = req.params;

      const projectHub = await projectHubService.getProjectHubById(hubId);

      res.status(200).json({
        success: true,
        data: projectHub,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get user's project hubs
  async getUserProjectHubs(req, res) {
    try {
      const userId = req.user.id;

      const projectHubs = await projectHubService.getUserProjectHubs(userId);

      res.status(200).json({
        success: true,
        data: projectHubs,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get all project hubs
  async getAllProjectHubs(req, res) {
    try {
      const { page = 1, limit = 10, tags } = req.query;

      const result = await projectHubService.getAllProjectHubs(
        parseInt(page),
        parseInt(limit),
        tags
      );

      res.status(200).json({
        success: true,
        data: result.projectHubs,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update project hub
  async updateProjectHub(req, res) {
    try {
      const { hubId } = req.params;
      const userId = req.user.id;
      const updateData = req.body;

      const projectHub = await projectHubService.updateProjectHub(hubId, userId, updateData);

      res.status(200).json({
        success: true,
        message: 'Project hub updated successfully',
        data: projectHub,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete project hub
  async deleteProjectHub(req, res) {
    try {
      const { hubId } = req.params;
      const userId = req.user.id;

      await projectHubService.deleteProjectHub(hubId, userId);

      res.status(200).json({
        success: true,
        message: 'Project hub deleted successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Add member to project hub
  async addMember(req, res) {
    try {
      const { hubId } = req.params;
      const userId = req.user.id;
      const { memberId, role } = req.body;

      const projectHub = await projectHubService.addMember(hubId, userId, memberId, role);

      res.status(200).json({
        success: true,
        message: 'Member added successfully',
        data: projectHub,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Remove member from project hub
  async removeMember(req, res) {
    try {
      const { hubId, userId: memberIdToRemove } = req.params;
      const userId = req.user.id;

      const projectHub = await projectHubService.removeMember(hubId, userId, memberIdToRemove);

      res.status(200).json({
        success: true,
        message: 'Member removed successfully',
        data: projectHub,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update member role
  async updateMemberRole(req, res) {
    try {
      const { hubId, userId: memberIdToUpdate } = req.params;
      const userId = req.user.id;
      const { role } = req.body;

      const projectHub = await projectHubService.updateMemberRole(
        hubId,
        userId,
        memberIdToUpdate,
        role
      );

      res.status(200).json({
        success: true,
        message: 'Member role updated successfully',
        data: projectHub,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Link showcase project
  async linkShowcaseProject(req, res) {
    try {
      const { hubId } = req.params;
      const userId = req.user.id;
      const { showcaseProjectId } = req.body;

      const projectHub = await projectHubService.linkShowcaseProject(
        hubId,
        userId,
        showcaseProjectId
      );

      res.status(200).json({
        success: true,
        message: 'Showcase project linked successfully',
        data: projectHub,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update integrations
  async updateIntegrations(req, res) {
    try {
      const { hubId } = req.params;
      const userId = req.user.id;
      const { integrations } = req.body;

      const projectHub = await projectHubService.updateIntegrations(
        hubId,
        userId,
        integrations
      );

      res.status(200).json({
        success: true,
        message: 'Integrations updated successfully',
        data: projectHub,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new ProjectHubController();
