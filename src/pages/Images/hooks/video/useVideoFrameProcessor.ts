
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
      // Function to be called when video recording is complete
      mediaRecorder.onstop = () => {
        console.log("MediaRecorder stopped, finalizing video");
        const videoBlob = finalizeVideoBlob(chunks, mediaRecorder, toast);
        resolve(videoBlob);
      };
      
      // Start recording
      mediaRecorder.start(500); // Create chunks every 500ms for more consistent processing
      console.log("MediaRecorder started");
      
      // Create an array of exact timestamps when each image should change
      const imageTimes = Array.from({ length: loadedImages.length }, (_, i) => i * secondsPerImage * 1000);
      
      // Draw the first image immediately
      drawImageCentered(ctx, canvas, loadedImages[0]);
      console.log(`Rendering image 1/${loadedImages.length}`);
      
      // Use a single RAF-based timing loop that runs for the entire duration
      let startTime: number;
      let currentImageIndex = 0;
      let animationFrameId: number;
      
      const renderLoop = (timestamp: number) => {
        // Initialize start time on first frame
        if (!startTime) startTime = timestamp;
        
        // Calculate elapsed time since animation started
        const elapsedTime = timestamp - startTime;
        
        // Determine which image should be showing based on elapsed time
        const targetImageIndex = Math.min(
          Math.floor(elapsedTime / (secondsPerImage * 1000)),
          loadedImages.length - 1
        );
        
        // Only redraw if the image needs to change
        if (targetImageIndex !== currentImageIndex) {
          currentImageIndex = targetImageIndex;
          drawImageCentered(ctx, canvas, loadedImages[currentImageIndex]);
          console.log(`Rendering image ${currentImageIndex + 1}/${loadedImages.length} at ${elapsedTime.toFixed(0)}ms`);
        }
        
        // Continue animation until we've reached the total duration
        if (elapsedTime < totalDurationMs) {
          animationFrameId = requestAnimationFrame(renderLoop);
        } else {
          // We've reached the exact end time
          console.log(`Animation complete at ${elapsedTime.toFixed(0)}ms (target: ${totalDurationMs}ms)`);
          
          // Ensure the last frame is showing
          if (currentImageIndex < loadedImages.length - 1) {
            currentImageIndex = loadedImages.length - 1;
            drawImageCentered(ctx, canvas, loadedImages[currentImageIndex]);
            console.log(`Rendering final image ${loadedImages.length}/${loadedImages.length}`);
          }
          
          // Stop the recording after a small delay to ensure the last frame is captured
          setTimeout(() => {
            console.log(`Stopping MediaRecorder after ${totalDurationMs + 200}ms`);
            mediaRecorder.stop();
          }, 200);
        }
      };
      
      // Start the animation loop
      animationFrameId = requestAnimationFrame(renderLoop);
      
      // Set a hard timeout as a failsafe to ensure recording stops
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          console.log(`Failsafe: Stopping MediaRecorder after ${totalDurationMs + 1000}ms`);
          cancelAnimationFrame(animationFrameId);
          mediaRecorder.stop();
        }
      }, totalDurationMs + 1000);
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
