import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'Not Started',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    column: {
      type: String,
      enum: ['backlog', 'todo', 'doing', 'review', 'done'],
      default: 'backlog',
    },
    order: {
      type: Number,
      default: 0,
    },
    assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile',
      },
    ],
    labels: [
      {
        type: String,
        trim: true,
      },
    ],
    dueDate: {
      type: Date,
    },
    attachments: [
      {
        url: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        size: {
          type: Number,
        },
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'UserProfile',
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    estimatedHours: {
      type: Number,
      default: 0,
    },
    actualHours: {
      type: Number,
      default: 0,
    },
    mileStoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Milestone',
      required: true,
    },
    projectHubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProjectHub',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserProfile',
    },
  },
  { timestamps: true }
);

// Index for efficient querying
taskSchema.index({ projectHubId: 1, column: 1, order: 1 });
taskSchema.index({ projectHubId: 1, mileStoneId: 1 });
taskSchema.index({ assignees: 1 });

const Task = mongoose.model('Task', taskSchema);
export default Task;
