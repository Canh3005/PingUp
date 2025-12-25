import express from "express";
import authRoutes from "./authRoutes.js";
import profileRoutes from "./profileRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import projectRoutes from "./projectRoutes.js";
import commentRoutes from "./commentRoutes.js";
import projectHubRoutes from "./projectHubRoutes.js";
import milestoneRoutes from "./milestoneRoutes.js";
import followRoutes from "./followRoutes.js";
import chatRoutes from "../chat/routes/chatRoutes.js";
import conversationRoutes from "../chat/routes/conversationRoutes.js";
import messageRoutes from "../chat/routes/messageRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/upload", uploadRoutes);
router.use("/projects", projectRoutes);
router.use("/comments", commentRoutes);
router.use("/project-hubs", projectHubRoutes);
router.use("/milestones", milestoneRoutes);
router.use("/users", followRoutes);
router.use("/chat", chatRoutes);
router.use("/chat/conversations", conversationRoutes);
router.use("/chat/conversations", messageRoutes);

export default router;
