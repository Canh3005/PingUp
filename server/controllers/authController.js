import authService from "../services/authService.js";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { accessToken, refreshToken, user } = await authService.login(
      req.body
    );
    res
      .status(200)
      .json({ message: "Login successful", accessToken, refreshToken, user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    // auth middleware already attaches sanitized user to req.user
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    return res.status(200).json({ user: req.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ error: "Refresh token is required" });
  }
  try {
    const newAccessToken = authService.refreshAccessToken(token);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res
      .status(403)
      .json({ error: "Invalid refresh token", detail: error.message });
  }
};

const updateUserType = async (req, res) => {
  try {
    const { type } = req.body;
    if (!type) {
      return res.status(400).json({ error: "Type is required" });
    }
    
    const user = await authService.updateUserType(req.user._id, type);
    res.status(200).json({ message: "User type updated successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateUserTopics = async (req, res) => {
  try {
    const { topics } = req.body;
    if (!topics) {
      return res.status(400).json({ error: "Topics are required" });
    }
    
    const user = await authService.updateUserTopics(req.user._id, topics);
    res.status(200).json({ message: "User topics updated successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const authController = {
  register,
  login,
  getProfile,
  refreshToken,
  updateUserType,
  updateUserTopics,
};

export default authController;
