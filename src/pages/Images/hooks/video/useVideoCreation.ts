
import { useState, useRef } from "react";
import { useImageSelection } from "./useImageSelection";
import { useVideoProcessing } from "./useVideoProcessing";
import { useToast } from "@/hooks/use-toast";

export const useVideoCreation = () => {
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);
  const [mp4Url, setMp4Url] = useState<string | null>(null);
  const [mp4Blob, setMp4Blob] = useState<Blob | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  
  const {
    previewImages,
    fileInputRef,
    handleImageSelect,
    triggerFileInput,
    setPreviewImages
  } = useImageSelection();
  
  const { processVideo } = useVideoProcessing({ previewImages });
  
  // Create video from selected images
  const createVideo = async () => {
    if (previewImages.length === 0) {
      toast({
        title: "No Images Selected",
        description: "Please select at least one image to create a video.",
        variant: "destructive",
      });
      return;
    }
    
    // Clean up previous video if it exists
    if (mp4Url) {
      URL.revokeObjectURL(mp4Url);
      setMp4Url(null);
    }
    
    setIsCreatingVideo(true);
    
    try {
      const videoBlob = await processVideo();
      
      if (videoBlob) {
        setMp4Blob(videoBlob);
        const url = URL.createObjectURL(videoBlob);
        setMp4Url(url);
        
        toast({
          title: "Video Created",
          description: `Created a ${previewImages.length * 2}-second video with ${previewImages.length} images.`,
        });
      }
    } catch (error) {
      console.error('Error creating video:', error);
      toast({
        title: "Video Creation Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        variant: "destructive",
      });
    } finally {
      setIsCreatingVideo(false);
    }
  };
  
  // Download the created video
  const handleDownloadVideo = () => {
    if (!mp4Url) {
      toast({
        title: "No Video Available",
        description: "Please create a video first.",
        variant: "destructive",
      });
      return;
    }
    
    const downloadLink = document.createElement('a');
    downloadLink.href = mp4Url;
    downloadLink.download = `slideshow-${new Date().toISOString().slice(0, 10)}.mp4`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  
  return {
    previewImages,
    mp4Url,
    isCreatingVideo,
    videoRef,
    fileInputRef,
    handleImageSelect,
    createVideo,
    handleDownloadVideo,
    triggerFileInput
  };
};
