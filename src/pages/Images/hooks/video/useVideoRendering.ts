
import { useState, useRef, useEffect } from "react";
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

      console.log(`Starting to process ${previewImages.length} images for video creation`);
      
      // Load all images first to get dimensions and ensure they're loaded
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
      
      // Create canvas for rendering
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error("Unable to create canvas context");
      }

      // Calculate dimensions - use fixed size for better quality
      const width = 1920; // Full HD width
      const height = 1080; // Full HD height
      
      canvas.width = width;
      canvas.height = height;
      
      console.log(`Video dimensions: ${width}x${height}`);
      
      // Configure high quality settings
      const framerate = 30; // 30fps
      const secondsPerImage = 2; // Each image shows for 2 seconds
      const framesPerImage = framerate * secondsPerImage;
      const totalFrames = previewImages.length * framesPerImage;
      
      // Set up MediaRecorder with high bitrate
      const stream = canvas.captureStream(framerate);
      
      // Try different MIME types in order of preference
      const videoOptions = [
        { mimeType: 'video/mp4; codecs=avc1.42E01E', bitrate: 8000000 },
        { mimeType: 'video/webm; codecs=vp9', bitrate: 8000000 },
        { mimeType: 'video/webm', bitrate: 8000000 }
      ];
      
      let mediaRecorder: MediaRecorder | null = null;
      let selectedMimeType = '';
      
      // Find the first supported MIME type
      for (const option of videoOptions) {
        if (MediaRecorder.isTypeSupported(option.mimeType)) {
          mediaRecorder = new MediaRecorder(stream, {
            mimeType: option.mimeType,
            videoBitsPerSecond: option.bitrate
          });
          selectedMimeType = option.mimeType;
          console.log(`Using MIME type: ${option.mimeType} with bitrate: ${option.bitrate / 1000000}Mbps`);
          break;
        }
      }
      
      if (!mediaRecorder) {
        // Fallback to browser default
        mediaRecorder = new MediaRecorder(stream);
        console.log('Using browser default MediaRecorder options');
      }
      
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
          console.log(`Received data chunk of size ${e.data.size} bytes`);
        }
      };
      
      // Draw an image centered on canvas with black background
      const drawImageCentered = (img: HTMLImageElement) => {
        // Fill with black background
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);
        
        // Calculate scaling to maintain aspect ratio
        const imgRatio = img.naturalWidth / img.naturalHeight;
        let drawWidth, drawHeight, x, y;
        
        if (imgRatio > width / height) {
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
      
      return new Promise<Blob | null>((resolve) => {
        let frameCount = 0;
        let currentImageIndex = 0;
        
        mediaRecorder.onstop = () => {
          if (chunks.length === 0) {
            console.error("No video data was recorded");
            toast({
              title: "Video Creation Failed",
              description: "No video data was recorded. Please try again with a different browser.",
              variant: "destructive",
            });
            resolve(null);
            return;
          }
          
          // Create the final blob with the proper MIME type
          const finalMimeType = selectedMimeType.split(';')[0] || 'video/mp4';
          const videoBlob = new Blob(chunks, { type: finalMimeType });
          mp4BlobRef.current = videoBlob;
          
          console.log(`Final video size: ${(videoBlob.size / (1024 * 1024)).toFixed(2)} MB`);
          
          const url = URL.createObjectURL(videoBlob);
          setMp4Url(url);
          
          if (videoBlob.size < 1000000) { // Less than 1MB
            toast({
              title: "Warning: Small File Size",
              description: "The generated video is small, which might indicate encoding issues. Try a different browser if needed.",
              variant: "warning",
            });
          } else {
            toast({
              title: "Video Created Successfully",
              description: `Video created (${(videoBlob.size / (1024 * 1024)).toFixed(2)} MB)`,
            });
          }
          
          resolve(videoBlob);
        };
        
        mediaRecorder.start(1000); // Collect data in 1-second chunks
        console.log("MediaRecorder started");
        
        // Animation loop to render frames
        const renderFrame = () => {
          if (frameCount >= totalFrames) {
            console.log(`Rendering complete. Total frames: ${frameCount}`);
            mediaRecorder.stop();
            return;
          }
          
          // Calculate which image to show based on current frame
          const imageIndex = Math.min(
            Math.floor(frameCount / framesPerImage),
            loadedImages.length - 1
          );
          
          // Only redraw when changing images
          if (imageIndex !== currentImageIndex) {
            currentImageIndex = imageIndex;
            console.log(`Rendering image ${currentImageIndex + 1}/${loadedImages.length}`);
            drawImageCentered(loadedImages[currentImageIndex]);
          }
          
          frameCount++;
          requestAnimationFrame(renderFrame);
        };
        
        // Start rendering
        renderFrame();
      });
    } catch (error) {
      console.error('Error creating video:', error);
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
