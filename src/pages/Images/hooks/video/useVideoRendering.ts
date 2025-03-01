
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
      // Create canvas element if it doesn't exist
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error("Unable to create canvas context");
      }
      
      // Clear any previous URL
      if (mp4Url) {
        URL.revokeObjectURL(mp4Url);
        setMp4Url(null);
      }

      console.log(`Starting to process ${previewImages.length} images for video creation`);
      
      // Preload all images to get dimensions and ensure they're ready
      const loadedImages = await Promise.all(
        previewImages.map(src => {
          return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
            img.src = src;
          });
        })
      );

      console.log(`Successfully loaded ${loadedImages.length} images`);
      
      // Calculate dimensions based on image aspect ratios
      const avgAspectRatio = loadedImages.reduce(
        (sum, img) => sum + (img.naturalWidth / img.naturalHeight), 
        0
      ) / loadedImages.length;
      
      // Use higher resolution for better quality
      const height = 1080; // Full HD height
      let width = Math.round(height * avgAspectRatio);
      // Ensure width is even (required for video encoding)
      width = width % 2 === 0 ? width : width + 1;
      
      canvas.width = width;
      canvas.height = height;
      
      console.log(`Video dimensions: ${width}x${height}, aspect ratio: ${avgAspectRatio.toFixed(2)}`);
      
      // Higher bitrate for better quality
      const bitrate = 20000000; // 20 Mbps
      const framerate = 30; // 30fps for smooth transitions
      
      // Set up MediaRecorder with optimal settings
      const stream = canvas.captureStream(framerate);
      
      // Try different codecs in order of preference
      let mediaRecorder;
      const mimeTypes = [
        'video/mp4;codecs=h264',
        'video/webm;codecs=h264',
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8'
      ];
      
      let usedMimeType = '';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          usedMimeType = mimeType;
          break;
        }
      }
      
      if (!usedMimeType) {
        usedMimeType = '';
        mediaRecorder = new MediaRecorder(stream);
      } else {
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: usedMimeType,
          videoBitsPerSecond: bitrate
        });
      }
      
      console.log(`Using MIME type: ${usedMimeType || 'browser default'}`);
      
      const videoChunks: Blob[] = [];
      
      // Collect video data chunks
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          videoChunks.push(e.data);
          console.log(`Received data chunk of size ${e.data.size} bytes`);
        }
      };
      
      // Function to draw an image centered on canvas
      const drawImageCentered = (img: HTMLImageElement) => {
        // Fill with black background
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);
        
        // Calculate scaling to maintain aspect ratio
        const imgRatio = img.naturalWidth / img.naturalHeight;
        let drawWidth, drawHeight, x, y;
        
        if (imgRatio > avgAspectRatio) {
          // Image is wider than canvas ratio
          drawWidth = width;
          drawHeight = width / imgRatio;
          x = 0;
          y = (height - drawHeight) / 2;
        } else {
          // Image is taller than canvas ratio
          drawHeight = height;
          drawWidth = height * imgRatio;
          x = (width - drawWidth) / 2;
          y = 0;
        }
        
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
      };
      
      return new Promise<Blob | null>((videoResolve) => {
        let currentImageIndex = 0;
        const frameDuration = 2000; // 2 seconds per image
        const recordingPadding = 500; // Extra time to ensure last frame is captured
        
        // Handle recording finished
        mediaRecorder.onstop = () => {
          if (videoChunks.length === 0) {
            console.error("No video data was recorded");
            toast({
              title: "Video Creation Failed",
              description: "No video data was recorded. Please try again.",
              variant: "destructive",
            });
            videoResolve(null);
            return;
          }
          
          // Create final video blob with proper MIME type
          const videoBlob = new Blob(videoChunks, { type: 'video/mp4' });
          mp4BlobRef.current = videoBlob;
          
          console.log(`Final video size: ${(videoBlob.size / (1024 * 1024)).toFixed(2)} MB`);
          
          // Generate URL for playback
          const url = URL.createObjectURL(videoBlob);
          setMp4Url(url);
          
          // Check if the video size is reasonable
          if (videoBlob.size < 500000) { // Less than 500KB
            toast({
              title: "Warning: Small File Size",
              description: "The generated video is very small, which might indicate encoding issues. Try a different browser if the video doesn't play correctly.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Video Created Successfully",
              description: `MP4 video created (${(videoBlob.size / (1024 * 1024)).toFixed(2)} MB)`,
            });
          }
          
          videoResolve(videoBlob);
        };
        
        // Start recording
        mediaRecorder.start();
        console.log("MediaRecorder started");
        
        // Function to process each image in sequence
        const processNextImage = () => {
          if (currentImageIndex < loadedImages.length) {
            const img = loadedImages[currentImageIndex];
            console.log(`Processing image ${currentImageIndex + 1}/${loadedImages.length}`);
            
            // Draw current image
            drawImageCentered(img);
            
            // Schedule next image
            currentImageIndex++;
            setTimeout(processNextImage, frameDuration);
          } else {
            // When all images are processed, ensure we capture the last frame
            // by waiting a bit before stopping the recorder
            console.log("All images processed, waiting for final frame capture");
            setTimeout(() => {
              console.log("Stopping MediaRecorder");
              mediaRecorder.stop();
            }, recordingPadding);
          }
        };
        
        // Start processing images after a short delay to ensure recorder is ready
        setTimeout(processNextImage, 100);
      });
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
