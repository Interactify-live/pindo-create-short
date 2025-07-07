import { getMediaDuration } from '../utils';
import { generateThumbnailFromFile } from '../../utils/thumbnail';
import { FileType, VideoType, ImageType, Media } from '../../interactions/types.d/types';

export interface ProcessedMedia {
  file: File;
  type: FileType;
  thumbnail?: File;
  duration?: number;
  src: string;
  thumbnailSrc?: string;
}

export const processMediaFile = async (file: File): Promise<ProcessedMedia> => {
  const type = file.type.startsWith('video/') ? VideoType : ImageType;
  const src = URL.createObjectURL(file);

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
      src,
      thumbnailSrc: thumbnail ? URL.createObjectURL(thumbnail) : undefined,
    };
  } else {
    return {
      file,
      type,
      src,
    };
  }
};

export const validateMediaConstraints = (
  medias: Media[],
  newMediaType: FileType,
  showToast: (message: string) => void
): boolean => {
  const videoCount = medias.filter(m => m.fileType === VideoType).length;
  const imageCount = medias.filter(m => m.fileType !== VideoType).length;

  if (newMediaType === VideoType && videoCount >= 1) {
    showToast("شما حداکثر یک ویدیو می توانید داشته باشید");
    return false;
  }

  if (newMediaType !== VideoType && imageCount >= 10) {
    showToast("شما حداکثر ۱۰ تصویر می توانید داشته باشید");
    return false;
  }

  return true;
};

export const validateVideoDuration = (
  duration: number,
  showToast: (message: string) => void
): boolean => {
  if (duration < 5 || duration > 70) {
    showToast("ویدیو باید بیشتر از ۵ و کمتر از ۷۰ ثانیه باشد");
    return false;
  }
  return true;
};

export const cleanupMediaUrls = (media: ProcessedMedia) => {
  URL.revokeObjectURL(media.src);
  if (media.thumbnailSrc) {
    URL.revokeObjectURL(media.thumbnailSrc);
  }
};