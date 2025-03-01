
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export const useVideoCreation = () => {
  const { toast } = useToast();
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const webmBlobRef = useRef<Blob | null>(null);

  const createVideo = async (previewImages: string[]) => {
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
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error("Unable to create canvas context");
      }
      
      const firstImage = new Image();
      await new Promise((resolve, reject) => {
        firstImage.onload = resolve;
        firstImage.onerror = reject;
        firstImage.src = previewImages[0];
      });
      
      const width = firstImage.width;
      const height = firstImage.height;
      canvas.width = width;
      canvas.height = height;
      
      const mimeType = 'video/webm';
      
      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType,
        videoBitsPerSecond: 8000000
      });
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      let videoBlob: Blob | null = null;

      await new Promise<void>((resolve) => {
        mediaRecorder.onstop = async () => {
          videoBlob = new Blob(chunks, { type: mimeType });
          webmBlobRef.current = videoBlob;
          const url = URL.createObjectURL(videoBlob);
          setVideoUrl(url);
          
          console.log(`Generated video size: ${(videoBlob.size / 1024 / 1024).toFixed(2)} MB`);
          
          toast({
            title: "Video Created",
            description: `Video created successfully (${(videoBlob.size / 1024 / 1024).toFixed(2)} MB)`,
          });
          resolve();
        };
        
        mediaRecorder.start();
        
        const frameDuration = 2000;
        
        const processImages = async () => {
          for (let i = 0; i < previewImages.length; i++) {
            const img = new Image();
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = previewImages[i];
            });
            
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            
            if (i < previewImages.length - 1) {
              await new Promise(resolve => setTimeout(resolve, frameDuration));
              
              const nextImg = new Image();
              await new Promise((resolve, reject) => {
                nextImg.onload = resolve;
                nextImg.onerror = reject;
                nextImg.src = previewImages[i + 1];
              });
              
              const transitionFrames = 15;
              const transitionDuration = 500;
              
              for (let j = 0; j < transitionFrames; j++) {
                const alpha = j / transitionFrames;
                
                ctx.clearRect(0, 0, width, height);
                ctx.globalAlpha = 1 - alpha;
                ctx.drawImage(img, 0, 0, width, height);
                ctx.globalAlpha = alpha;
                ctx.drawImage(nextImg, 0, 0, width, height);
                ctx.globalAlpha = 1;
                
                await new Promise(resolve => 
                  setTimeout(resolve, transitionDuration / transitionFrames)
                );
              }
            } else {
              await new Promise(resolve => setTimeout(resolve, frameDuration));
            }
          }
          
          mediaRecorder.stop();
        };
        
        processImages();
      });
      
      return videoBlob;
    } catch (error) {
      console.error('Error creating video:', error);
      toast({
        title: "Video Creation Failed",
        description: `Error: ${error.message || 'Unknown error occurred'}`,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsCreatingVideo(false);
    }
  };

  return {
    isCreatingVideo,
    videoUrl,
    setVideoUrl,
    webmBlobRef,
    createVideo
  };
};
