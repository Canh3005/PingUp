import mongoose from "mongoose";

const blockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'photo-grid', 'embed', 'lightroom', 'prototype', '3d'],
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.Mixed, // Can be string (text/url), array (images), object (embed data)
  },
  // For text blocks
  textStyles: {
    fontSize: { type: Number, default: 20 },
    fontFamily: { type: String, default: 'Helvetica' },
    isBold: { type: Boolean, default: false },
    isItalic: { type: Boolean, default: false },
    isUnderline: { type: Boolean, default: false },
    textAlign: { type: String, enum: ['left', 'center', 'right'], default: 'left' },
    textColor: { type: String, default: '#000000' },
  },
  // For image/video blocks
  mediaUrl: {
    type: String,
  },
  // Block order
  order: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

const projectSchema = new mongoose.Schema(
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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blocks: [blockSchema],
    
    // Project styles
    styles: {
      backgroundColor: {
        type: String,
        default: '#FFFFFF',
      },
      contentSpacing: {
        type: Number,
        default: 60,
        min: 0,
        max: 200,
      },
    },
    
    // Project metadata
    coverImage: {
      type: String, // URL to cover image
    },
    tags: [{
      type: String,
      trim: true,
    }],
    category: {
      type: String,
      trim: true,
    },
    toolsUsed: {
      type: String,
      trim: true,
    },
    
    // Visibility & status
    visibility: {
      type: String,
      enum: ['everyone', 'connections', 'private'],
      default: 'everyone',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    
    // Engagement metrics
    views: {
      type: Number,
      default: 0,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    
    // Publishing dates
    publishedAt: {
      type: Date,
    },
    projectHubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProjectHub',
    }
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
projectSchema.index({ owner: 1, status: 1 });
projectSchema.index({ status: 1, publishedAt: -1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ category: 1 });

// Virtual for likes count
projectSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

// Method to publish project
projectSchema.methods.publish = function() {
  this.status = 'published';
  this.publishedAt = new Date();
  return this.save();
};

// Method to increment views
projectSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

const Project = mongoose.model("Project", projectSchema);

export default Project;
