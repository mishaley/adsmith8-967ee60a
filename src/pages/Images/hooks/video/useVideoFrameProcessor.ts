
import { setupCanvas, loadImages, drawImageCentered } from "./useCanvasUtils";
import { createMediaRecorder, getMimeType } from "./useMediaRecorder";

/**
 * Core video frame processing logic
 */
export const processImagesIntoVideo = async (previewImages: string[], toast: any): Promise<Blob | null> => {
  try {
    // Load all images first to get dimensions and ensure they're loaded
    const loadedImages = await loadImages(previewImages);
    console.log(`Successfully loaded ${loadedImages.length} images`);
    
    // Create canvas for rendering
    const { canvas, ctx } = setupCanvas();
    
    // Configure high quality settings
    const framerate = 30; // 30fps
    const secondsPerImage = 2; // Each image shows for exactly 2 seconds
    const framesPerImage = framerate * secondsPerImage;
    const totalFrames = previewImages.length * framesPerImage;
    
    // Set up MediaRecorder with high bitrate
    const stream = canvas.captureStream(framerate);
    const chunks: Blob[] = [];
    
    const mediaRecorder = createMediaRecorder({
      stream,
      onDataAvailable: (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
          console.log(`Received data chunk of size ${e.data.size} bytes`);
        }
      }
    });
    
    return new Promise<Blob | null>((resolve) => {
      let frameCount = 0;
      let currentImageIndex = 0;
      
      mediaRecorder.onstop = () => {
        const videoBlob = finalizeVideoBlob(chunks, mediaRecorder, toast);
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
          drawImageCentered(ctx, canvas, loadedImages[currentImageIndex]);
        }
        
        frameCount++;
        requestAnimationFrame(renderFrame);
      };
      
      // Start rendering
      renderFrame();
    });
  } catch (error) {
    console.error('Error in processImagesIntoVideo:', error);
    throw error;
  }
};

/**
 * Finalizes the video blob from recorded chunks
 */
const finalizeVideoBlob = (chunks: Blob[], mediaRecorder: MediaRecorder, toast: any): Blob | null => {
  if (chunks.length === 0) {
    console.error("No video data was recorded");
    toast({
      title: "Video Creation Failed",
      description: "No video data was recorded. Please try again with a different browser.",
      variant: "destructive",
    });
    return null;
  }
  
  // Create the final blob with the proper MIME type
  const finalMimeType = getMimeType(mediaRecorder);
  const videoBlob = new Blob(chunks, { type: finalMimeType });
  
  console.log(`Final video size: ${(videoBlob.size / (1024 * 1024)).toFixed(2)} MB`);
  
  if (videoBlob.size < 1000000) { // Less than 1MB
    toast({
      title: "Warning: Small File Size",
      description: "The generated video is small, which might indicate encoding issues. Try a different browser if needed.",
      variant: "destructive",
    });
  } else {
    toast({
      title: "Video Created Successfully",
      description: `Video created (${(videoBlob.size / (1024 * 1024)).toFixed(2)} MB)`,
    });
  }
  
  return videoBlob;
};
