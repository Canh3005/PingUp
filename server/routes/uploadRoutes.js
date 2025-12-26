import express from 'express';
import { uploadImage, uploadPortfolio, uploadProjectBlock } from '../configs/cloudinary.js';
import { uploadAvatar, uploadCoverImage, uploadPortfolioItem, uploadBlockImage, uploadBlockVideo, deleteFile } from '../controllers/uploadController.js';
import auth from '../middlewares/auth.js';
import { handleUploadError } from '../middlewares/uploadErrorHandler.js';

const router = express.Router();

router.post('/avatar', auth, uploadImage.single('avatar'), handleUploadError, uploadAvatar);
router.post('/cover', auth, uploadImage.single('cover'), handleUploadError, uploadCoverImage);
router.post('/portfolio', auth, uploadPortfolio.single('portfolio'), handleUploadError, uploadPortfolioItem);
router.post('/image', auth, uploadProjectBlock.single('image'), handleUploadError, uploadBlockImage);
router.post('/video', auth, uploadProjectBlock.single('video'), handleUploadError, uploadBlockVideo);
router.delete('/file', auth, deleteFile);

export default router;