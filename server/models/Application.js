import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    recruitment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recruitment',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserProfile',
      required: true,
    },
    coverNote: {
      type: String,
      required: true,
    },
    portfolio: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'shortlisted', 'accepted', 'rejected'],
      default: 'pending',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserProfile',
    },
    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Indexes for efficient querying
applicationSchema.index({ recruitment: 1, status: 1 });
applicationSchema.index({ applicant: 1 });
applicationSchema.index({ recruitment: 1, applicant: 1 }, { unique: true }); // Prevent duplicate applications

const Application = mongoose.model('Application', applicationSchema);
export default Application;
