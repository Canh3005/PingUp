import mongoose from 'mongoose';

const devlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserProfile',
      required: true,
    },
    projectHub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProjectHub',
      required: true,
    },
    media: [
      {
        type: {
          type: String,
          enum: ['image', 'video', 'audio'],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        title: {
          type: String,
        },
        thumbnail: {
          type: String,
        },
      },
    ],
    reactions: {
      heart: {
        type: Number,
        default: 0,
      },
      fire: {
        type: Number,
        default: 0,
      },
      rocket: {
        type: Number,
        default: 0,
      },
    },
    reactedUsers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'UserProfile',
        },
        reactionType: {
          type: String,
          enum: ['heart', 'fire', 'rocket'],
        },
      },
    ],
    visibility: {
      type: String,
      enum: ['public', 'team'],
      default: 'team',
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for efficient querying
devlogSchema.index({ projectHub: 1, createdAt: -1 });
devlogSchema.index({ author: 1 });

const Devlog = mongoose.model('Devlog', devlogSchema);

export default Devlog;
