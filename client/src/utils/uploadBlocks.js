import uploadApi from '../api/uploadApi';
import { toast } from 'react-hot-toast';

/**
 * Upload all media blocks (images and videos) to Cloudinary
 * @param {Array} blocks - Array of block objects
 * @returns {Promise<Array>} - Array of blocks with uploaded mediaUrl
 */
export const uploadBlocks = async (blocks) => {
  return await Promise.all(
    blocks.map(async (block, index) => {
      let mediaUrl = block.mediaUrl;
      
      try {
        // If block has a File object (new upload), upload it
        if (block.type === 'image' && block.content instanceof File) {
          const uploadResponse = await uploadApi.uploadImage(block.content);
          mediaUrl = uploadResponse.url;
        } else if (block.type === 'video' && block.content instanceof File) {
          const uploadResponse = await uploadApi.uploadVideo(block.content);
          mediaUrl = uploadResponse.url;
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || `Failed to upload ${block.type}`;
        throw new Error(errorMessage);
      }

      return {
        type: block.type,
        content: block.type === 'text' ? block.content : '', // Only text blocks have content
        order: index,
        textStyles: block.textStyles,
        mediaUrl: mediaUrl,
      };
    })
  );
};
