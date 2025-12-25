import mongoose from 'mongoose';

const tashkSchema = new mongoose.Schema(
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
    mileStoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Milestone',
      required: true,
    },
    projectHubId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProjectHub',
        required: true,
    }
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', tashkSchema);
export default Task;
