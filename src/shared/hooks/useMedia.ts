import { useState, useCallback } from 'react';
import { getMediaDuration } from '../utils';
import { generateThumbnailFromFile } from '../../utils/thumbnail';
import { FileType, VideoType, ImageType } from '../../interactions/types.d/types';

interface MediaFile {
  file: File;
  type: FileType;
  thumbnail?: File;
  duration?: number;
}

export const useMedia = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processMediaFile = useCallback(async (file: File): Promise<MediaFile> => {
    setIsProcessing(true);

    try {
      const type = file.type.startsWith('video/') ? VideoType : ImageType;

      if (type === VideoType) {
        const [duration, thumbnail] = await Promise.all([
          getMediaDuration(file),
          generateThumbnailFromFile(file)
        ]);

        return {
          file,
          type,
          thumbnail,
          duration,
        };
      } else {
        return {
          file,
          type,
        };
      }
    } catch (error) {
      console.error('Error processing media file:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const validateMediaFile = useCallback((file: File, type: FileType) => {
    const errors: string[] = [];

    if (type === VideoType) {
      // Video validation logic can be added here
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        errors.push('Video file size must be less than 100MB');
      }
    } else {
      // Image validation logic
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        errors.push('Image file size must be less than 10MB');
      }
    }

    return errors;
  }, []);

  return {
    processMediaFile,
    validateMediaFile,
    isProcessing,
  };
};