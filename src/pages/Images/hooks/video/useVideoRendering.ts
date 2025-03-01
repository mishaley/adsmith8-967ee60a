
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useVideoProcessing } from "./useVideoProcessing";

interface VideoRenderingOptions {
  previewImages: string[];
}

export const useVideoRendering = ({ previewImages }: VideoRenderingOptions) => {
  const { toast } = useToast();
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);
  const [mp4Url, setMp4Url] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mp4BlobRef = useRef<Blob | null>(null);
  const { processVideo } = useVideoProcessing({ previewImages });

  // Clean up any previous blob URL when component unmounts
  useEffect(() => {
    return () => {
      if (mp4Url) {
        URL.revokeObjectURL(mp4Url);
      }
    };
  }, [mp4Url]);

  const createVideo = async () => {
    if (previewImages.length === 0) {
      toast({
        title: "No Images Selected",
        description: "Please select at least one image to create a video.",
        variant: "destructive",
      });
      return null;
    }

    setIsCreatingVideo(true);
    
    try {
      // Clean up previous URL if it exists
      if (mp4Url) {
        URL.revokeObjectURL(mp4Url);
        setMp4Url(null);
      }

      const videoBlob = await processVideo();
      
      if (videoBlob) {
        mp4BlobRef.current = videoBlob;
        const url = URL.createObjectURL(videoBlob);
        setMp4Url(url);
        return videoBlob;
      }
      
      return null;
    } catch (error) {
      console.error('Error in createVideo:', error);
      toast({
        title: "Video Creation Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsCreatingVideo(false);
    }
  };
  
  return {
    isCreatingVideo,
    mp4Url,
    videoRef,
    mp4BlobRef,
    createVideo,
    setMp4Url
  };
};
