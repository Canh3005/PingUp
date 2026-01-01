import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema(
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
        fromDate: {
            type: Date,
        },
        dueDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['Not Started', 'In Progress', 'Completed'],
            default: 'Not Started',
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        totalTasks: {
            type: Number,
            default: 0,
        },
        completedTasks: {
            type: Number,
            default: 0,
        },
        projectHubId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProjectHub',
            required: true,
        },
    },
    { timestamps: true }
);

const Milestone = mongoose.model('Milestone', milestoneSchema);

export default Milestone;