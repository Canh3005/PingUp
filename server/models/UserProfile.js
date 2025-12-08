import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },
    website: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    coverImageUrl: {
      type: String,
      default: "",
    },
    portfolioItems: [
      {
        url: String,
        publicId: String,
        title: String,
        description: String,
        type: { type: String, enum: ["image", "video", "pdf"] },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    projects: {
      type: [
        {
          title: String,
          description: String,
          image: String,
        },
      ],
      default: [],
    },
    experiences: [
      {
        jobTitle: {
          type: String,
          required: true,
          trim: true,
        },
        organization: {
          type: String,
          required: true,
          trim: true,
        },
        startYear: {
          type: String,
          required: true,
        },
        endYear: {
          type: String,
          default: "",
        },
        currentlyWorking: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
          default: "",
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    education: [
      {
        school: {
          type: String,
          required: true,
          trim: true,
        },
        degree: {
          type: String,
          required: true,
          trim: true,
        },
        fieldOfStudy: {
          type: String,
          required: true,
          trim: true,
        },
        startYear: {
          type: String,
          required: true,
        },
        endYear: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("UserProfile", userProfileSchema);
