import multer from 'multer';

export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        error: 'File size too large',
        message: 'The uploaded file exceeds the maximum allowed size',
        maxSize: req.route.path.includes('portfolio') || req.route.path.includes('video') 
          ? '10MB' 
          : '5MB'
      });
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: 'Unexpected field',
        message: 'Unexpected file field in upload'
      });
    }

    // Other multer errors
    return res.status(400).json({
      success: false,
      error: 'Upload error',
      message: err.message
    });
  }

  // Pass to next error handler if not a multer error
  next(err);
};
