import mongoose from 'mongoose';

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
    details: {
        type: String,
        trim: true,
    },
    },
    { timestamps: true }
);

const HubActivity = mongoose.model('HubActivity', hubActivitySchema);
export default HubActivity;