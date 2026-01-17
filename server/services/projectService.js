import Project from '../models/Project.js';
import UserProfile from '../models/UserProfile.js';
import Devlog from '../models/Devlog.js';
import Milestone from '../models/Milestone.js';
import { cloudinary } from '../configs/cloudinary.js';

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
        .populate({
          path: 'projectHubId',
          select: 'visibility progress totalTasks completedTasks members integrations updatedAt',
          populate: {
            path: 'members.user',
            select: 'name avatarUrl',
            options: { limit: 6 }
          }
        });
      
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

      // Handle Project Hub data
      if (projectObj.projectHubId) {
        // Check if ProjectHub is private and user is not authorized
        if (projectObj.projectHubId.visibility === 'private') {
          const isOwner = userId && projectObj.owner._id.toString() === userId;
          const isMember = userId && projectObj.projectHubId.members?.some(
            m => m.user && m.user._id.toString() === userId
          );
          
          if (!isOwner && !isMember) {
            // Keep only visibility field for frontend to know it exists but is private
            projectObj.projectHubId = {
              _id: projectObj.projectHubId._id,
              visibility: 'private'
            };
          } else {
            // User is authorized, fetch additional stats
            await this.enrichProjectHubData(projectObj);
          }
        } else {
          // Public Project Hub, fetch additional stats
          await this.enrichProjectHubData(projectObj);
        }
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
      console.error('Error in getUserProjects:', error);
      throw new Error(`Error fetching user projects: ${error.message}`);
    }
  }

  // Get published projects (feed)
  async getPublishedProjects(page = 1, limit = 12, filters = {}) {
    try {
      const query = { status: 'published', isPublic: true };

      if (filters.category) {
        // Use regex to match category in comma-separated string
        // This will match "Graphic Design" in "Graphic Design, Photography"
        query.category = { $regex: new RegExp(filters.category, 'i') };
      }
      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags };
      }

      const skip = (page - 1) * limit;

      // Build sort object
      const sortBy = filters.sortBy || 'publishedAt';
      const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;
      
      let projects;
      
      // For sorting by likes count, we need to use aggregation
      if (sortBy === 'likes') {
        projects = await Project.aggregate([
          { $match: query },
          { $addFields: { likesCount: { $size: '$likes' } } },
          { $sort: { likesCount: sortOrder } },
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as: 'owner'
            }
          },
          { $unwind: '$owner' },
          {
            $project: {
              blocks: 0,
              'owner.password': 0,
              'owner.email': 0
            }
          }
        ]);
      } else {
        // For other sorts, use regular query
        let sortObj = {};
        if (sortBy === 'views') {
          sortObj = { views: sortOrder };
        } else if (sortBy === 'createdAt') {
          sortObj = { createdAt: sortOrder };
        } else {
          sortObj = { publishedAt: sortOrder };
        }

        projects = await Project.find(query)
          .sort(sortObj)
          .skip(skip)
          .limit(limit)
          .populate('owner', 'userName imageUrl')
          .select('-blocks'); // Don't return blocks in feed
      }

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

  // Helper: Enrich Project Hub data with additional stats
  async enrichProjectHubData(projectObj) {
    try {
      if (!projectObj.projectHubId || !projectObj.projectHubId._id) {
        return;
      }

      const hubId = projectObj.projectHubId._id;

      // Fetch devlog count
      const devlogCount = await Devlog.countDocuments({ projectHub: hubId });
      
      // Fetch milestone stats
      const milestones = await Milestone.find({ projectHubId: hubId });
      const completedMilestones = milestones.filter(m => m.status === 'Completed').length;
      
      // Attach stats to projectHubId
      projectObj.projectHubId.devlogCount = devlogCount;
      projectObj.projectHubId.milestoneStats = {
        completed: completedMilestones,
        total: milestones.length
      };

      // Limit members array to 6 if it exists
      if (projectObj.projectHubId.members && projectObj.projectHubId.members.length > 6) {
        projectObj.projectHubId.members = projectObj.projectHubId.members.slice(0, 6);
        projectObj.projectHubId.hasMoreMembers = true;
      }
    } catch (error) {
      console.error('Error enriching Project Hub data:', error);
      // Don't throw error, just log it and continue
    }
  }

  // Get projects from followed users
  async getFollowingProjects(followingIds, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc') {
    try {
      // If not following anyone, return empty result
      if (!followingIds || followingIds.length === 0) {
        return {
          projects: [],
          pagination: {
            page,
            limit,
            total: 0,
            pages: 0
          }
        };
      }

      // Build sort object
      const sortObj = {};
      sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Get total count
      const total = await Project.countDocuments({
        owner: { $in: followingIds },
        status: 'published'
      });

      // Fetch projects from followed users
      const projects = await Project.find({
        owner: { $in: followingIds },
        status: 'published'
      })
        .populate('owner', 'userName imageUrl email')
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      return {
        projects,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error fetching following projects: ${error.message}`);
    }
  }
}

export default new ProjectService();
