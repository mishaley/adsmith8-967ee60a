
import { useImageSelection } from "./useImageSelection";
import { useVideoRendering } from "./useVideoRendering";
import { useVideoDownload } from "./useVideoDownload";

export const useVideoCreation = () => {
  const {
    previewImages,
    fileInputRef,
    handleImageSelect,
    triggerFileInput
  } = useImageSelection();

  const {
    isCreatingVideo,
    mp4Url,
    videoRef,
    mp4BlobRef,
    createVideo
  } = useVideoRendering({ previewImages });

  const { handleDownloadVideo } = useVideoDownload({ mp4Url, mp4BlobRef });

  return {
    previewImages,
    mp4Url,
    isCreatingVideo,
    videoRef,
    fileInputRef,
    mp4BlobRef,
    handleImageSelect,
    createVideo,
    handleDownloadVideo,
    triggerFileInput
  };
};
