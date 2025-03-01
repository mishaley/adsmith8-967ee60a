
import { setupCanvas, loadImages, drawImageCentered } from "./useCanvasUtils";
import { createMediaRecorder, getMimeType } from "./useMediaRecorder";

/**
 * Core video frame processing logic using a synchronous, frame-by-frame approach
 */
export const processImagesIntoVideo = async (previewImages: string[], toast: any): Promise<Blob | null> => {
  try {
    if (previewImages.length === 0) {
      throw new Error("No images provided");
    }
    
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
    const totalDuration = previewImages.length * secondsPerImage;
    
    console.log(`Creating video with ${previewImages.length} images, ${framesPerImage} frames per image, ${totalFrames} total frames`);
    console.log(`Expected duration: ${totalDuration} seconds (${totalDuration.toFixed(2)}s)`);
    
    // Generate all frames synchronously first, then encode the video
    const frames: ImageData[] = [];
    
    // Generate every single frame in advance
    for (let i = 0; i < totalFrames; i++) {
      const imageIndex = Math.floor(i / framesPerImage);
      
      // Safety check to avoid index out of bounds
      if (imageIndex >= loadedImages.length) {
        console.error(`Invalid image index: ${imageIndex} (max: ${loadedImages.length - 1})`);
        continue;
      }
      
      // Draw the current image to the canvas
      drawImageCentered(ctx, canvas, loadedImages[imageIndex]);
      
      // Store the frame
      const frameData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      frames.push(frameData);
      
      // Log progress for specific frames
      if (i === 0 || i % framesPerImage === 0 || i === totalFrames - 1) {
        console.log(`Generated frame ${i + 1}/${totalFrames} - Image ${imageIndex + 1}/${loadedImages.length}`);
      }
    }
    
    console.log(`All ${frames.length} frames generated successfully`);
    
    // Now encode all frames into a video
    return await encodeFramesToVideo(frames, canvas, framerate, toast);
  } catch (error) {
    console.error('Error in processImagesIntoVideo:', error);
    if (toast) {
      toast({
        title: "Video Creation Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        variant: "destructive",
      });
    }
    throw error;
  }
};

/**
 * Encode pre-generated frames into a video at a fixed framerate
 */
const encodeFramesToVideo = async (
  frames: ImageData[], 
  canvas: HTMLCanvasElement, 
  framerate: number, 
  toast: any
): Promise<Blob | null> => {
  return new Promise<Blob | null>((resolve) => {
    const ctx = canvas.getContext('2d')!;
    const stream = canvas.captureStream(0); // We'll manually add frames
    const videoTrack = (stream as any).getVideoTracks()[0];
    const frameWriter = (videoTrack as any).writable;
    
    // Set up MediaRecorder with high bitrate
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
    
    mediaRecorder.onstop = () => {
      console.log("MediaRecorder stopped, finalizing video");
      const videoBlob = finalizeVideoBlob(chunks, mediaRecorder, toast, frames.length / framerate);
      resolve(videoBlob);
    };
    
    // Start recording
    mediaRecorder.start(500); // Create chunks every 500ms
    console.log("MediaRecorder started");
    
    // Draw each frame at the exact framerate interval
    let frameIndex = 0;
    
    const processFrames = () => {
      if (frameIndex < frames.length) {
        ctx.putImageData(frames[frameIndex], 0, 0);
        
        // Log every 30 frames (every second) for debugging
        if (frameIndex % 30 === 0 || frameIndex === frames.length - 1) {
          const imageIndex = Math.floor(frameIndex / (framerate * 2));
          console.log(`Rendering frame ${frameIndex + 1}/${frames.length} - Image ${imageIndex + 1}/${frames.length / (framerate * 2)}`);
        }
        
        // Force the stream to capture this frame
        (videoTrack as any).requestFrame();
        
        frameIndex++;
        
        // Process next frame on next animation frame to maintain exact timing
        requestAnimationFrame(processFrames);
      } else {
        // End processing after a small delay to ensure the last frame is captured
        setTimeout(() => {
          mediaRecorder.stop();
          console.log(`Video rendering complete. Total frames processed: ${frameIndex}`);
        }, 200);
      }
    };
    
    // Start frame processing
    processFrames();
  });
};

/**
 * Finalizes the video blob from recorded chunks
 */
const finalizeVideoBlob = (
  chunks: Blob[], 
  mediaRecorder: MediaRecorder, 
  toast: any,
  expectedDurationSeconds: number
): Blob | null => {
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
  
  const fileSizeMB = (videoBlob.size / (1024 * 1024)).toFixed(2);
  console.log(`Final video size: ${fileSizeMB} MB`);
  console.log(`Expected duration: ${expectedDurationSeconds.toFixed(2)} seconds`);
  
  if (videoBlob.size < 100000) { // Less than 100KB
    toast({
      title: "Warning: Small File Size",
      description: "The generated video is very small, which might indicate encoding issues. Try a different browser if needed.",
      variant: "destructive",
    });
  } else {
    toast({
      title: "Video Created Successfully",
      description: `Video created (${fileSizeMB} MB) with expected duration of ${expectedDurationSeconds.toFixed(1)} seconds`,
    });
  }
  
  return videoBlob;
};
