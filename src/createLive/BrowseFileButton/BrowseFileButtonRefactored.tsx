import React from 'react';
import { Media, VideoType } from '../../interactions/types.d/types';
import { Gallery } from '../../icons';
import { FileInput } from '../../shared/components';
import { validateMediaConstraints } from '../../shared/utils/mediaUtils';

interface Props {
  onSelect(files: File[]): void;
  disabled: boolean;
  showToast: (message: string) => void;
  medias: Media[];
}

function BrowseFileButtonRefactored({ onSelect, disabled, showToast, medias }: Props) {
  const handleFileSelect = async (files: File[]) => {
    const videos: File[] = [];
    const images: File[] = [];

    // Separate videos and images
    for (const file of files) {
      const type = file.type;
      if (type.startsWith('video/')) {
        videos.push(file);
      } else if (type.startsWith('image/')) {
        images.push(file);
      } else {
        console.warn('Unsupported file type:', type);
      }
    }

    // Validate constraints
    const hasExistingVideo = medias.some(m => m.fileType === VideoType);
    const existingImageCount = medias.filter(m => m.fileType !== VideoType).length;

    // Check video constraint
    if (videos.length > 0 && hasExistingVideo) {
      showToast('شما حداکثر یک ویدیو می توانید داشته باشید');
      return;
    }

    // Check image constraint
    const totalImagesAfterAdd = existingImageCount + images.length;
    if (totalImagesAfterAdd > 10) {
      const allowedImages = 10 - existingImageCount;
      showToast(`شما حداکثر ۱۰ تصویر می توانید داشته باشید`);

      // If also trying to add a video, prioritize the video
      if (videos.length > 0 && !hasExistingVideo) {
        onSelect([videos[0], ...images.slice(0, allowedImages)]);
      } else {
        onSelect(images.slice(0, allowedImages));
      }
    } else {
      onSelect([...videos, ...images]);
    }
  };

  return (
    <FileInput
      onSelect={handleFileSelect}
      accept="image/*,video/*"
      multiple
      disabled={disabled}
      style={{
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <Gallery />
      <span
        style={{
          fontSize: '10px',
          fontWeight: 500,
          lineHeight: '16px',
          marginTop: '4px',
        }}
      >
        گالری
      </span>
    </FileInput>
  );
}

export default BrowseFileButtonRefactored;