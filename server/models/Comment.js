import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    // For nested replies (optional, can implement later)
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
commentSchema.index({ project: 1, createdAt: -1 });
commentSchema.index({ author: 1 });

// Virtual for likes count
commentSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
