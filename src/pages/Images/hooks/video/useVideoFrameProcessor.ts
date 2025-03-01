
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
    
    // Create canvas with dimensions based on the loaded images
    const { canvas, ctx } = setupCanvas(loadedImages);
    
    // Configure high quality settings
    const framerate = 30; // 30fps
    const secondsPerImage = 2; // Each image shows for exactly 2 seconds
    const totalDurationMs = previewImages.length * secondsPerImage * 1000; // Total duration in ms
    
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
      mediaRecorder.onstop = () => {
        console.log("MediaRecorder stopped, finalizing video");
        const videoBlob = finalizeVideoBlob(chunks, mediaRecorder, toast);
        resolve(videoBlob);
      };
      
      // Start recording
      mediaRecorder.start(500); // Smaller chunk size for more consistent processing
      console.log("MediaRecorder started");
      
      // Draw the first image immediately
      drawImageCentered(ctx, canvas, loadedImages[0]);
      console.log(`Rendering image 1/${loadedImages.length}`);
      
      // Use requestAnimationFrame for precise timing control
      let currentFrame = 0;
      const totalFrames = loadedImages.length * secondsPerImage * framerate;
      
      const animate = (timestamp: number) => {
        // Calculate which image should be shown based on frame count
        const imageIndex = Math.min(
          Math.floor(currentFrame / (secondsPerImage * framerate)),
          loadedImages.length - 1
        );
        
        // Draw the current image
        drawImageCentered(ctx, canvas, loadedImages[imageIndex]);
        
        // Log when changing to a new image
        if (currentFrame % (secondsPerImage * framerate) === 0 && imageIndex > 0) {
          console.log(`Rendering image ${imageIndex + 1}/${loadedImages.length}`);
        }
        
        currentFrame++;
        
        // Continue animation until we've shown all frames
        if (currentFrame < totalFrames) {
          requestAnimationFrame(animate);
        } else {
          // We've completed all frames, stop recording after a short delay to ensure last frame is captured
          console.log(`All ${totalFrames} frames rendered (${loadedImages.length} images at ${framerate}fps for ${secondsPerImage}s each)`);
          console.log(`Stopping MediaRecorder after exact duration of ${totalDurationMs}ms`);
          
          setTimeout(() => {
            mediaRecorder.stop();
          }, 500); // Small delay to ensure the last frame is captured fully
        }
      };
      
      // Start the animation loop
      requestAnimationFrame(animate);
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
  
  if (videoBlob.size < 100000) { // Less than 100KB
    toast({
      title: "Warning: Small File Size",
      description: "The generated video is very small, which might indicate encoding issues. Try a different browser if needed.",
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
