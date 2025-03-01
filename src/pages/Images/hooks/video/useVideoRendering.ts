
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
      
      // Load the first image to determine dimensions
      const firstImage = new Image();
      await new Promise<void>((resolve, reject) => {
        firstImage.onload = () => resolve();
        firstImage.onerror = reject;
        firstImage.src = previewImages[0];
      });
      
      // Set standard dimensions that work well with macOS Preview
      // Using 1280x720 (720p) which is a standard video resolution
      let width = 1280;
      let height = 720;
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      console.log(`Video dimensions: ${width}x${height}`);
      
      // Use higher bitrate for better quality
      const bitRate = 10000000; // 10 Mbps - high quality
      
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
        
        mediaRecorder.start();
        
        // Process the images with simple hard cuts
        createSimpleSlideshow(ctx, canvas, mediaRecorder, previewImages, width, height).catch(error => {
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
  previewImages: string[],
  width: number,
  height: number
) => {
  const frameDuration = 2000; // 2 seconds per image
  
  // Fill with black first to ensure correct initialization
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);
  
  // Load all images first to prevent loading delays during recording
  const images = await Promise.all(previewImages.map(async (src) => {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
    return img;
  }));
  
  // Now display each image
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    
    // Clear canvas with black background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
    
    // Calculate position to center image maintaining aspect ratio
    const imgWidth = img.width;
    const imgHeight = img.height;
    const scale = Math.min(width / imgWidth, height / imgHeight);
    const x = (width - imgWidth * scale) / 2;
    const y = (height - imgHeight * scale) / 2;
    
    // Draw image with proper scaling
    ctx.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);
    
    // Wait for duration
    await new Promise(resolve => setTimeout(resolve, frameDuration));
    
    // Hold the last frame longer
    if (i === images.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Extra half second for last frame
    }
  }
  
  mediaRecorder.stop();
};
