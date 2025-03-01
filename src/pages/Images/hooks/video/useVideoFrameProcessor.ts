
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
      mediaRecorder.onstop = () => {
        console.log("MediaRecorder stopped, finalizing video");
        const videoBlob = finalizeVideoBlob(chunks, mediaRecorder, toast);
        resolve(videoBlob);
      };
      
      // Start recording
      mediaRecorder.start(500); // Create chunks every 500ms
      console.log("MediaRecorder started");
      
      // Pre-calculate all frame data - which image should be shown on which frame
      const frameData = [];
      for (let i = 0; i < totalFrames; i++) {
        const imageIndex = Math.floor(i / framesPerImage);
        frameData.push({
          frameNumber: i,
          imageIndex: Math.min(imageIndex, loadedImages.length - 1),
          isLastFrameForImage: (i + 1) % framesPerImage === 0 || i === totalFrames - 1
        });
      }
      
      // Draw initial frame
      drawImageCentered(ctx, canvas, loadedImages[0]);
      console.log(`Rendering image 1/${loadedImages.length}`);
      
      let currentFrame = 0;
      let currentImageIndex = 0;
      
      // Use fixed interval timing for precise frame control
      const frameInterval = 1000 / framerate;
      
      const processNextFrame = () => {
        if (currentFrame >= totalFrames) {
          // End of video - add a small padding to ensure the last frame is captured
          setTimeout(() => {
            mediaRecorder.stop();
            console.log(`Video processing complete. Total frames: ${totalFrames}`);
          }, 200);
          return;
        }
        
        const frameInfo = frameData[currentFrame];
        
        // Only redraw if we're changing images
        if (frameInfo.imageIndex !== currentImageIndex) {
          currentImageIndex = frameInfo.imageIndex;
          drawImageCentered(ctx, canvas, loadedImages[currentImageIndex]);
          console.log(`Rendering image ${currentImageIndex + 1}/${loadedImages.length} at frame ${currentFrame}`);
        }
        
        // Schedule next frame with consistent timing
        currentFrame++;
        setTimeout(processNextFrame, frameInterval);
      };
      
      // Start the frame processing
      processNextFrame();
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
