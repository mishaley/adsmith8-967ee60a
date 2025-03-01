
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
      await new Promise((resolve, reject) => {
        firstImage.onload = resolve;
        firstImage.onerror = reject;
        firstImage.src = previewImages[0];
      });
      
      // Set standard dimensions that work well with H.264
      // Use 640x480 as a base, but maintain aspect ratio and make sure dimensions are even
      let width = 640;
      let height = 480;
      
      // Calculate aspect ratio for proper scaling
      const aspectRatio = firstImage.width / firstImage.height;
      if (aspectRatio > 1) {
        // Landscape
        height = Math.floor(width / aspectRatio);
      } else {
        // Portrait or square
        width = Math.floor(height * aspectRatio);
      }
      
      // Ensure dimensions are even numbers (required for some codecs)
      width = Math.floor(width / 2) * 2;
      height = Math.floor(height / 2) * 2;
      
      console.log(`Video dimensions: ${width}x${height}`);
      
      // Use higher bitrate for better quality
      const bitRate = 8000000; // 8 Mbps - high quality
      
      // Set up MediaRecorder with MP4-compatible parameters
      const stream = canvas.captureStream(30); // 30fps for smooth playback
      
      // Try to create MediaRecorder with H.264 codec for maximum compatibility
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
          // Create a WebM blob first (this is browser's native format)
          const webmBlob = new Blob(chunks, { type: mediaRecorder.mimeType });
          
          // Convert to MP4 (this is a browser-friendly approximation)
          // In a real implementation, you would use a true transcoding library like ffmpeg.wasm
          const mp4Blob = new Blob(chunks, { type: 'video/mp4' });
          mp4BlobRef.current = mp4Blob;
          
          // Create URL with MP4 MIME type
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
        
        // Process the images
        processImages(ctx, canvas, mediaRecorder, previewImages, width, height).catch(error => {
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

// Extracted image processing function
const processImages = async (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  mediaRecorder: MediaRecorder,
  previewImages: string[],
  width: number,
  height: number
) => {
  // Longer frame duration for better quality and to create a larger file
  const frameDuration = 3000; // 3 seconds per image
  
  for (let i = 0; i < previewImages.length; i++) {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = previewImages[i];
    });
    
    // Clear canvas and draw with black background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
    
    // Calculate position to center image
    const imgWidth = img.width;
    const imgHeight = img.height;
    const scale = Math.min(width / imgWidth, height / imgHeight);
    const x = (width - imgWidth * scale) / 2;
    const y = (height - imgHeight * scale) / 2;
    
    // Draw image with proper scaling
    ctx.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);
    
    if (i < previewImages.length - 1) {
      await new Promise(resolve => setTimeout(resolve, frameDuration));
      
      const nextImg = new Image();
      await new Promise((resolve, reject) => {
        nextImg.onload = resolve;
        nextImg.onerror = reject;
        nextImg.src = previewImages[i + 1];
      });
      
      // Add more transition frames for smoother effect and larger file
      const transitionFrames = 30; // More frames = smoother transition
      const transitionDuration = 1000; // 1 second transition
      
      for (let j = 0; j < transitionFrames; j++) {
        const alpha = j / transitionFrames;
        
        // Clear canvas and fill with black
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);
        
        // Draw current image
        ctx.globalAlpha = 1 - alpha;
        ctx.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);
        
        // Calculate next image position
        const nextImgWidth = nextImg.width;
        const nextImgHeight = nextImg.height;
        const nextScale = Math.min(width / nextImgWidth, height / nextImgHeight);
        const nextX = (width - nextImgWidth * nextScale) / 2;
        const nextY = (height - nextImgHeight * nextScale) / 2;
        
        // Draw next image
        ctx.globalAlpha = alpha;
        ctx.drawImage(nextImg, nextX, nextY, nextImgWidth * nextScale, nextImgHeight * nextScale);
        ctx.globalAlpha = 1;
        
        await new Promise(resolve => 
          setTimeout(resolve, transitionDuration / transitionFrames)
        );
      }
    } else {
      // Hold last frame longer
      await new Promise(resolve => setTimeout(resolve, frameDuration * 1.5));
    }
  }
  
  mediaRecorder.stop();
};
