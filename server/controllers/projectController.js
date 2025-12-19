import projectService from '../services/projectService.js';
import _ from 'lodash';

class ProjectController {
  // Create new project
  async createProject(req, res) {
    try {
      const userId = req.user.id;
      const projectData = req.body;

      const project = await projectService.createProject(userId, projectData);

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get project by ID
  async getProject(req, res) {
    try {
      const { projectId } = req.params;
      const userId = req.user?.id;

      const project = await projectService.getProjectById(projectId, userId);

      res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update project
  async updateProject(req, res) {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;
      const updateData = req.body;

      const project = await projectService.updateProject(projectId, userId, updateData);

      res.status(200).json({
        success: true,
        message: 'Project updated successfully',
        data: project,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update project blocks
  async updateBlocks(req, res) {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;
      const { blocks } = req.body;

      const project = await projectService.updateBlocks(projectId, userId, blocks);

      res.status(200).json({
        success: true,
        message: 'Blocks updated successfully',
        data: project,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update project styles
  async updateStyles(req, res) {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;
      const { styles } = req.body;

      const project = await projectService.updateStyles(projectId, userId, styles);

      res.status(200).json({
        success: true,
        message: 'Styles updated successfully',
        data: project,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete project
  async deleteProject(req, res) {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;

      const result = await projectService.deleteProject(projectId, userId);

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

  // Publish project
  async publishProject(req, res) {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;

      const project = await projectService.publishProject(projectId, userId);

      res.status(200).json({
        success: true,
        message: 'Project published successfully',
        data: project,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get user's projects
  async getUserProjects(req, res) {
    try {
      const userId = req.user.id;
      const { status } = req.query;

      const projects = await projectService.getUserProjects(userId, status);

      res.status(200).json({
        success: true,
        data: projects,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get published projects (feed)
  async getPublishedProjects(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const filters = {
        category: req.query.category,
        tags: req.query.tags ? req.query.tags.split(',') : [],
      };

      const result = await projectService.getPublishedProjects(page, limit, filters);

      res.status(200).json({
        success: true,
        data: result.projects,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get user's published projects by userId
  async getUserPublishedProjects(req, res) {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit) || 6;
      const excludeProjectId = req.query.excludeProjectId || null;

      const projects = await projectService.getUserPublishedProjects(
        userId,
        limit,
        excludeProjectId
      );

      res.status(200).json({
        success: true,
        projects,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Toggle like on project
  async toggleLike(req, res) {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;

      const result = await projectService.toggleLike(projectId, userId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Increment view count
  async incrementView(req, res) {
    try {
      const { projectId } = req.params;

      await projectService.incrementView(projectId);

      res.status(200).json({
        success: true,
        message: 'View count incremented',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new ProjectController();
