import { cloudinary } from "../configs/cloudinary.js";

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    res.json({
      success: true,
      url: req.file.path,
      publicId: req.file.filename,
    });
  } catch (error) {
    console.error("Upload avatar error:", error);
    res.status(500).json({ error: "Failed to upload avatar" });
  }
};

export const uploadCoverImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    res.json({
      success: true,
      url: req.file.path,
      publicId: req.file.filename,
    });
  } catch (error) {
    console.error("Upload cover error:", error);
    res.status(500).json({ error: "Failed to upload cover image" });
  }
};

export const uploadPortfolioItem = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    res.json({
      success: true,
      url: req.file.path,
      publicId: req.file.filename,
      resourceType: req.file.resource_type,
      format: req.file.format,
    });
  } catch (error) {
    console.error("Upload portfolio error:", error);
    res.status(500).json({ error: "Failed to upload portfolio item" });
  }
};

export const uploadBlockImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    console.log("Uploaded block image:", req.file);

    res.json({
      success: true,
      url: req.file.path,
      publicId: req.file.filename,
    });
  } catch (error) {
    console.error("Upload block image error:", error);
    res.status(500).json({ error: "Failed to upload block image" });
  }
};

export const uploadBlockVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    res.json({
      success: true,
      url: req.file.path,
      publicId: req.file.filename,
      resourceType: req.file.resource_type,
      format: req.file.format,
    });
  } catch (error) {
    console.error("Upload block video error:", error);
    res.status(500).json({ error: "Failed to upload block video" });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ error: "Public ID required" });
    }

    await cloudinary.uploader.destroy(publicId);

    res.json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
};
