
import { useToast } from "@/hooks/use-toast";
import { processImagesIntoVideo } from "./useVideoFrameProcessor";

interface VideoProcessingOptions {
  previewImages: string[];
}

export const useVideoProcessing = ({ previewImages }: VideoProcessingOptions) => {
  const { toast } = useToast();
  
  const processVideo = async (): Promise<Blob | null> => {
    if (previewImages.length === 0) {
      toast({
        title: "No Images Selected",
        description: "Please select at least one image to create a video.",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      console.log(`Starting video creation with ${previewImages.length} images`);
      const expectedDuration = previewImages.length * 2;
      console.log(`Expected duration: ${expectedDuration} seconds`);
      
      const videoBlob = await processImagesIntoVideo(previewImages, toast);
      
      if (!videoBlob) {
        console.error("Failed to create video: No blob returned");
        return null;
      }
      
      console.log(`Video created successfully: ${(videoBlob.size / (1024 * 1024)).toFixed(2)} MB`);
      return videoBlob;
    } catch (error) {
      console.error('Error in processVideo:', error);
      toast({
        title: "Video Creation Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        variant: "destructive",
      });
      return null;
    }
  };
  
  return { processVideo };
};
