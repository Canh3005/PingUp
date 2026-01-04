import mongoose from 'mongoose';

const recruitmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'One-time'],
      default: 'Full-time',
    },
    location: {
      type: String,
      enum: ['Remote', 'On-site', 'Hybrid'],
      default: 'Remote',
    },
    credits: {
      type: String,
      trim: true,
    },
    positions: {
      type: Number,
      default: 1,
      min: 1,
    },
    status: {
      type: String,
      enum: ['open', 'filled', 'closed'],
      default: 'open',
    },
    projectHub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProjectHub',
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserProfile',
      required: true,
    },
    filledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserProfile',
    },
    filledAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Indexes for efficient querying
recruitmentSchema.index({ projectHub: 1, status: 1 });
recruitmentSchema.index({ postedBy: 1 });

const Recruitment = mongoose.model('Recruitment', recruitmentSchema);
export default Recruitment;
