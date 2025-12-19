import Project from '../models/Project.js';
import UserProfile from '../models/UserProfile.js';
import { cloudinary } from '../configs/cloudinary.js';
import { Types } from 'mongoose';

class ProjectService {
  // Create new project
  async createProject(userId, projectData) {
    try {
      const project = new Project({
        ...projectData,
        owner: userId,
        status: 'draft',
      });
      
      await project.save();
      return project;
    } catch (error) {
      throw new Error(`Error creating project: ${error.message}`);
    }
  }

  // Get project by ID
  async getProjectById(projectId, userId = null) {
    try {
      const project = await Project.findById(projectId)
        .populate('owner', 'userName imageUrl email')
        .populate('likes', 'userName imageUrl');
      
      if (!project) {
        throw new Error('Project not found');
      }

      // Check if user has permission to view draft projects
      if (project.status === 'draft' && (!userId || project.owner._id.toString() !== userId)) {
        throw new Error('Access denied');
      }

      // Manually populate owner's profile
      const ownerProfile = await UserProfile.findOne({ userId: project.owner._id })
        .select('name jobTitle bio avatarUrl location website skills');
      
      // Attach profile to owner
      const projectObj = project.toObject();
      if (ownerProfile) {
        projectObj.owner.profile = ownerProfile;
      }

      return projectObj;
    } catch (error) {
      throw new Error(`Error fetching project: ${error.message}`);
    }
  }

  // Update project
  async updateProject(projectId, userId, updateData) {
    try {
      const project = await Project.findById(projectId);
      
      if (!project) {
        throw new Error('Project not found');
      }

      // Check ownership
      if (project.owner.toString() !== userId) {
        throw new Error('Not authorized to update this project');
      }
      Object.assign(project, updateData);
      await project.save();
      
      return project;
    } catch (error) {
      throw new Error(`Error updating project: ${error.message}`);
    }
  }

  // Update project blocks
  async updateBlocks(projectId, userId, blocks) {
    try {
      const project = await Project.findById(projectId);
      
      if (!project) {
        throw new Error('Project not found');
      }

      if (project.owner.toString() !== userId) {
        throw new Error('Not authorized to update this project');
      }

      project.blocks = blocks;
      await project.save();
      
      return project;
    } catch (error) {
      throw new Error(`Error updating blocks: ${error.message}`);
    }
  }

  // Update project styles
  async updateStyles(projectId, userId, styles) {
    try {
      const project = await Project.findById(projectId);
      
      if (!project) {
        throw new Error('Project not found');
      }

      if (project.owner.toString() !== userId) {
        throw new Error('Not authorized to update this project');
      }

      project.styles = { ...project.styles, ...styles };
      await project.save();
      
      return project;
    } catch (error) {
      throw new Error(`Error updating styles: ${error.message}`);
    }
  }

  // Delete project
  async deleteProject(projectId, userId) {
    try {
      const project = await Project.findById(projectId);
      
      if (!project) {
        throw new Error('Project not found');
      }

      if (project.owner.toString() !== userId) {
        throw new Error('Not authorized to delete this project');
      }

      // Delete associated media from Cloudinary
      for (const block of project.blocks) {
        if (block.mediaUrl) {
          const publicId = this.extractPublicId(block.mediaUrl);
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        }
      }

      await Project.findByIdAndDelete(projectId);
      return { message: 'Project deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting project: ${error.message}`);
    }
  }

  // Publish project
  async publishProject(projectId, userId) {
    try {
      const project = await Project.findById(projectId);
      
      if (!project) {
        throw new Error('Project not found');
      }

      if (project.owner.toString() !== userId) {
        throw new Error('Not authorized to publish this project');
      }

      await project.publish();
      return project;
    } catch (error) {
      throw new Error(`Error publishing project: ${error.message}`);
    }
  }

  // Get user's projects
  async getUserProjects(userId, status = null) {
    try {
      const query = { owner: userId };  
      if (status) {
        query.status = status;
      }
      const projects = await Project.find(query)
        .sort({ updatedAt: -1 })
        .populate('owner', 'userName imageUrl');
      
      return projects;
    } catch (error) {
      console.error("Error in getUserProjects:", error);
      throw new Error(`Error fetching user projects: ${error.message}`);
    }
  }

  // Get published projects (feed)
  async getPublishedProjects(page = 1, limit = 12, filters = {}) {
    try {
      const query = { status: 'published', isPublic: true };

      if (filters.category) {
        query.category = filters.category;
      }
      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags };
      }

      const skip = (page - 1) * limit;

      const projects = await Project.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('owner', 'userName imageUrl')
        .select('-blocks'); // Don't return blocks in feed

      const total = await Project.countDocuments(query);

      return {
        projects,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error fetching published projects: ${error.message}`);
    }
  }

  // Get user's published projects by userId (for author works section)
  async getUserPublishedProjects(userId, limit = 6, excludeProjectId = null) {
    try {
      const query = {
        owner: userId,
        status: 'published',
        isPublic: true,
      };

      if (excludeProjectId) {
        query._id = { $ne: excludeProjectId };
      }

      const projects = await Project.find(query)
        .sort({ publishedAt: -1 })
        .limit(limit)
        .select('title coverImage views likes publishedAt');

      return projects;
    } catch (error) {
      throw new Error(`Error fetching user published projects: ${error.message}`);
    }
  }

  // Like/Unlike project
  async toggleLike(projectId, userId) {
    try {
      const project = await Project.findById(projectId);
      
      if (!project) {
        throw new Error('Project not found');
      }

      const likeIndex = project.likes.indexOf(userId);
      
      if (likeIndex > -1) {
        // Unlike
        project.likes.splice(likeIndex, 1);
      } else {
        // Like
        project.likes.push(userId);
      }

      await project.save();
      return {
        isLiked: likeIndex === -1,
        likesCount: project.likes.length,
      };
    } catch (error) {
      throw new Error(`Error toggling like: ${error.message}`);
    }
  }

  // Increment view count
  async incrementView(projectId) {
    try {
      const project = await Project.findById(projectId);
      
      if (!project) {
        throw new Error('Project not found');
      }

      await project.incrementViews();
      return project;
    } catch (error) {
      throw new Error(`Error incrementing view: ${error.message}`);
    }
  }

  // Add comment to project
  async addComment(projectId, userId, content) {
    try {
      if (!content || !content.trim()) {
        throw new Error('Comment content is required');
      }

      const project = await Project.findById(projectId);
      if (!project) {
        throw new Error('Project not found');
      }

      const comment = new Comment({
        project: projectId,
        author: userId,
        content: content.trim(),
      });

      await comment.save();

      // Populate author info
      await comment.populate('author', 'userName imageUrl');
      
      // Populate author's profile
      const authorProfile = await UserProfile.findOne({ userId: comment.author._id })
        .select('name jobTitle avatarUrl');
      
      const commentObj = comment.toObject();
      if (authorProfile) {
        commentObj.author.profile = authorProfile;
      }

      return commentObj;
    } catch (error) {
      throw new Error(`Error adding comment: ${error.message}`);
    }
  }

  // Get comments for project
  async getComments(projectId) {
    try {
      const comments = await Comment.find({ project: projectId, parentComment: null })
        .sort({ createdAt: -1 })
        .populate('author', 'userName imageUrl')
        .populate('likes', 'userName imageUrl');

      // Populate author profiles
      const commentsWithProfiles = await Promise.all(
        comments.map(async (comment) => {
          const commentObj = comment.toObject();
          const authorProfile = await UserProfile.findOne({ userId: comment.author._id })
            .select('name jobTitle avatarUrl');
          
          if (authorProfile) {
            commentObj.author.profile = authorProfile;
          }
          
          return commentObj;
        })
      );

      return commentsWithProfiles;
    } catch (error) {
      throw new Error(`Error fetching comments: ${error.message}`);
    }
  }

  // Delete comment
  async deleteComment(commentId, userId) {
    try {
      const comment = await Comment.findById(commentId);
      
      if (!comment) {
        throw new Error('Comment not found');
      }

      if (comment.author.toString() !== userId) {
        throw new Error('Not authorized to delete this comment');
      }

      await Comment.findByIdAndDelete(commentId);
      return { message: 'Comment deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting comment: ${error.message}`);
    }
  }

  // Toggle like on comment
  async toggleCommentLike(commentId, userId) {
    try {
      const comment = await Comment.findById(commentId);
      
      if (!comment) {
        throw new Error('Comment not found');
      }

      const likeIndex = comment.likes.indexOf(userId);
      
      if (likeIndex > -1) {
        comment.likes.splice(likeIndex, 1);
      } else {
        comment.likes.push(userId);
      }

      await comment.save();
      return {
        isLiked: likeIndex === -1,
        likesCount: comment.likes.length,
      };
    } catch (error) {
      throw new Error(`Error toggling comment like: ${error.message}`);
    }
  }

  // Helper: Extract Cloudinary public ID from URL
  extractPublicId(url) {
    try {
      const matches = url.match(/\/v\d+\/(.+)\./);
      return matches ? matches[1] : null;
    } catch {
      return null;
    }
  }
}

export default new ProjectService();
