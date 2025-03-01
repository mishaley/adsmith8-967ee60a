
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
      console.log(`Starting to process ${previewImages.length} images for video creation`);
      
      const videoBlob = await processImagesIntoVideo(previewImages, toast);
      
      if (!videoBlob) {
        return null;
      }
      
      return videoBlob;
    } catch (error) {
      console.error('Error creating video:', error);
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
