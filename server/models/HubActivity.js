import mongoose from 'mongoose';
import { ACTIVITY_TYPES, getAllActivityTypes } from '../constants/activityTypes.js';

const hubActivitySchema = new mongoose.Schema(
  {
    projectHubId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProjectHub',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile',
        required: true,
    },
    action: {
        type: String,
        required: true,
        trim: true,
    },
    activityType: {
        type: String,
        enum: getAllActivityTypes(),
        default: ACTIVITY_TYPES.OTHER,
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    targetName: {
        type: String,
        trim: true,
    },
    details: {
        type: String,
        trim: true,
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
    },
    },
    { timestamps: true }
);

// Index for efficient querying
hubActivitySchema.index({ projectHubId: 1, createdAt: -1 });
hubActivitySchema.index({ user: 1 });
hubActivitySchema.index({ activityType: 1 });

const HubActivity = mongoose.model('HubActivity', hubActivitySchema);
export default HubActivity;