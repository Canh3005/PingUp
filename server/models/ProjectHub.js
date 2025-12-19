import mongoose from "mongoose";

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
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "UserProfile",
          required: true,
        },
        role: {
          type: String,
          trim: true,
        },
      },
    ],
    milestones: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Milestone",
      },
    ],
    showcaseProjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
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

const ProjectHub = mongoose.model("ProjectHub", projectSchema);

export default ProjectHub;
