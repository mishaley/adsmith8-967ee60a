
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

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
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error("Unable to create canvas context");
      }
      
      // Load all images first to get their natural dimensions
      const images = await Promise.all(previewImages.map(async (src) => {
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = src;
        });
        return img;
      }));
      
      if (images.length === 0) {
        throw new Error("Failed to load images");
      }
      
      // Calculate optimal dimensions that respect aspect ratio
      // Get the average aspect ratio from all images
      let totalRatio = 0;
      images.forEach(img => {
        totalRatio += img.naturalWidth / img.naturalHeight;
      });
      const avgAspectRatio = totalRatio / images.length;
      
      // Set dimensions that maintain aspect ratio with a fixed height
      const height = 720; // Standard 720p height
      const width = Math.round(height * avgAspectRatio);
      
      // Ensure width is even (required for some codecs)
      const finalWidth = width % 2 === 0 ? width : width + 1;
      
      // Set canvas dimensions
      canvas.width = finalWidth;
      canvas.height = height;
      
      console.log(`Video dimensions: ${finalWidth}x${height}, Aspect ratio: ${avgAspectRatio.toFixed(2)}`);
      
      // Use higher bitrate for better quality
      const bitRate = 8000000; // 8 Mbps - good quality
      
      // Set up MediaRecorder with MP4-compatible parameters
      const stream = canvas.captureStream(30); // 30fps for smooth playback
      
      // Try to create MediaRecorder with H.264 codec
      let mediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=h264',
          videoBitsPerSecond: bitRate
        });
      } catch (e) {
        console.log("H.264 not supported, falling back to VP8");
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp8',
          videoBitsPerSecond: bitRate
        });
      }
      
      console.log(`Using codec: ${mediaRecorder.mimeType}`);
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      await new Promise<void>((resolve) => {
        mediaRecorder.onstop = async () => {
          // Create a MP4 blob
          const mp4Blob = new Blob(chunks, { type: 'video/mp4' });
          mp4BlobRef.current = mp4Blob;
          
          // Create URL
          const url = URL.createObjectURL(mp4Blob);
          setMp4Url(url);
          
          console.log(`Generated MP4 size: ${(mp4Blob.size / 1024 / 1024).toFixed(2)} MB`);
          console.log(`Video MIME type: ${mp4Blob.type}`);
          
          toast({
            title: "Video Created",
            description: `MP4 video created successfully (${(mp4Blob.size / 1024 / 1024).toFixed(2)} MB)`,
          });
          
          resolve();
        };
        
        // Important: Start recording *before* drawing the first frame
        // This ensures we don't miss the first frame
        mediaRecorder.start();
        
        // Process the images with simple hard cuts
        createSimpleSlideshow(ctx, canvas, mediaRecorder, images, finalWidth, height).catch(error => {
          console.error("Error processing images:", error);
          mediaRecorder.stop();
        });
      });
      
      return mp4BlobRef.current;
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
    mp4Url,
    videoRef,
    mp4BlobRef,
    createVideo,
    setMp4Url
  };
};

// Simple slideshow with hard cuts between images
const createSimpleSlideshow = async (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  mediaRecorder: MediaRecorder,
  images: HTMLImageElement[],
  width: number,
  height: number
) => {
  const frameDuration = 2000; // 2 seconds per image
  
  // Now display each image
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    
    // Clear canvas with black background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
    
    // Calculate position to center image maintaining aspect ratio
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const scale = Math.min(width / imgWidth, height / imgHeight);
    const x = (width - imgWidth * scale) / 2;
    const y = (height - imgHeight * scale) / 2;
    
    // Draw image with proper scaling
    ctx.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);
    
    // Wait for duration (except for the last image)
    if (i < images.length - 1) {
      await new Promise(resolve => setTimeout(resolve, frameDuration));
    } else {
      // For the last image, wait a bit longer to ensure it's captured
      await new Promise(resolve => setTimeout(resolve, frameDuration + 500));
    }
  }
  
  mediaRecorder.stop();
};
