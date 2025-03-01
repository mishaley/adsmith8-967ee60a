
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
        img.crossOrigin = "anonymous"; // Add this for cross-origin images
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
      
      // Use much higher bitrate for better quality
      const bitRate = 15000000; // 15 Mbps - much better quality
      
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
      
      let videoBlob: Blob | null = null;
      
      await new Promise<void>((resolve) => {
        mediaRecorder.onstop = async () => {
          // Create a more robust video file
          videoBlob = new Blob(chunks, { type: 'video/mp4' });
          mp4BlobRef.current = videoBlob;
          
          // Create URL
          if (mp4Url) {
            URL.revokeObjectURL(mp4Url); // Clean up old URL
          }
          const url = URL.createObjectURL(videoBlob);
          setMp4Url(url);
          
          console.log(`Generated MP4 size: ${(videoBlob.size / 1024 / 1024).toFixed(2)} MB`);
          console.log(`Video MIME type: ${videoBlob.type}`);
          
          toast({
            title: "Video Created",
            description: `MP4 video created successfully (${(videoBlob.size / 1024 / 1024).toFixed(2)} MB)`,
          });
          
          resolve();
        };
        
        // First, draw initial frame before starting recording
        // This ensures we don't get a black frame at the start
        const firstImage = images[0];
        drawImageCentered(ctx, firstImage, finalWidth, height);
        
        // Start recording after the first frame is drawn
        mediaRecorder.start();
        
        // Process all images with hard cuts
        createImageSlideshow(ctx, canvas, mediaRecorder, images, finalWidth, height).catch(error => {
          console.error("Error processing images:", error);
          mediaRecorder.stop();
        });
      });
      
      // If the file is suspiciously small, warn the user
      if (videoBlob && videoBlob.size < 500000) { // Less than 500KB is suspicious
        toast({
          title: "Warning: Small File Size",
          description: "The generated video is very small, which might indicate encoding issues. Try a different browser if the video doesn't play correctly.",
          variant: "destructive", // Changed from "warning" to "destructive"
        });
      }
      
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

// Helper function to draw an image centered on the canvas
const drawImageCentered = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number
) => {
  // Clear canvas with black background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Calculate position to center image maintaining aspect ratio
  const imgWidth = img.naturalWidth;
  const imgHeight = img.naturalHeight;
  const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
  const x = (canvasWidth - imgWidth * scale) / 2;
  const y = (canvasHeight - imgHeight * scale) / 2;
  
  // Draw image with proper scaling
  ctx.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);
};

// Slideshow with hard cuts between images
const createImageSlideshow = async (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  mediaRecorder: MediaRecorder,
  images: HTMLImageElement[],
  width: number,
  height: number
) => {
  const frameDuration = 2000; // 2 seconds per image
  
  // Display each image for the duration
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    
    // Draw the image centered on the canvas
    drawImageCentered(ctx, img, width, height);
    
    // Wait for the specified duration
    await new Promise(resolve => setTimeout(resolve, frameDuration));
  }
  
  // Ensure we have some extra time at the end to capture the last frame
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Stop recording after all images have been processed
  mediaRecorder.stop();
};
