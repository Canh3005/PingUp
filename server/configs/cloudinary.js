import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage cho avatar/cover
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pingup/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

// Storage cho portfolio (hỗ trợ cả PDF)
const portfolioStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pingup/portfolio',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'mp4'],
    resource_type: 'auto'
  }
});

// Storage cho project blocks (chất lượng cao, không giới hạn kích thước)
const projectBlockStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pingup/projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    quality: 'auto:best', // Tự động chọn chất lượng tốt nhất
    fetch_format: 'auto' // Tự động chọn format tối ưu
  }
});

export const uploadImage = multer({ 
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export const uploadPortfolio = multer({ 
  storage: portfolioStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

export const uploadProjectBlock = multer({
  storage: projectBlockStorage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB cho project blocks
});

export { cloudinary };