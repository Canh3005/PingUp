import mongoose from "mongoose";

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
        dueDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["Not Started", "In Progress", "Completed"],
            default: "Not Started",
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProjectHub",
            required: true,
        },
    },
    { timestamps: true }
);

const Milestone = mongoose.model("Milestone", milestoneSchema);

export default Milestone;