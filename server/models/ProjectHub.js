import mongoose from 'mongoose';
import { PROJECT_HUB_ROLES } from '../constants/projectHubRoles.js';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String, // URL to logo image
    },
    description: {
      type: String,
      trim: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
    totalTasks: {
      type: Number,
      default: 0,
    },
    completedTasks: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'UserProfile',
          required: true,
        },
        permissionRole: {
          type: String,
          enum: Object.values(PROJECT_HUB_ROLES),
          default: PROJECT_HUB_ROLES.MEMBER,
          required: true,
        },
        jobPosition: {
          type: String,
          trim: true,
        },
      },
    ],
    milestones: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Milestone',
      },
    ],
    showcaseProjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    integrations: {
      github: { type: String, trim: true },
      figma: { type: String, trim: true },
      discord: { type: String, trim: true },
    },
    invisibility: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ProjectHub = mongoose.model('ProjectHub', projectSchema);

export default ProjectHub;
