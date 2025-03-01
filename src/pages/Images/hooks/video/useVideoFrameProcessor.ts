
import { useToast } from "@/hooks/use-toast";

/**
 * Core video processing logic using direct HTML5 Video API
 */
export const processImagesIntoVideo = async (previewImages: string[], toast: any): Promise<Blob | null> => {
  try {
    if (previewImages.length === 0) {
      throw new Error("No images provided");
    }
    
    console.log(`Starting to process ${previewImages.length} images for video creation`);
    
    // Load all images first to ensure they're available
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
    
    // Create and configure video element for recording
    const videoElement = document.createElement('video');
    videoElement.autoplay = true;
    videoElement.muted = true;
    videoElement.playsInline = true;
    videoElement.width = 1280;
    videoElement.height = 720;
    
    // Create media source for the video
    const mediaSource = new MediaSource();
    videoElement.src = URL.createObjectURL(mediaSource);
    
    // Create a MediaRecorder to capture the video
    const videoStream = (videoElement as any).captureStream();
    const mediaRecorder = new MediaRecorder(videoStream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 5000000 // 5Mbps
    });
    
    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };
    
    return new Promise<Blob | null>((resolve) => {
      mediaSource.addEventListener('sourceopen', async () => {
        // Create source buffer for video
        const sourceBuffer = mediaSource.addSourceBuffer('video/webm;codecs=vp9');
        
        // Each image appears for exactly 2 seconds
        const secondsPerImage = 2;
        
        // Create WebM segments for each image
        let segments: Blob[] = [];
        
        // Process each image
        for (let i = 0; i < loadedImages.length; i++) {
          console.log(`Processing image ${i + 1}/${loadedImages.length}`);
          
          // Create a video segment for this image
          const imageSegment = await createImageSegment(loadedImages[i], secondsPerImage);
          segments.push(imageSegment);
        }
        
        // Combine all segments into one WebM file
        const videoBlob = new Blob(segments, { type: 'video/webm' });
        
        // Start recording
        mediaRecorder.start();
        
        // Play the WebM file
        const objectURL = URL.createObjectURL(videoBlob);
        videoElement.src = objectURL;
        videoElement.play();
        
        // Record for the exact duration
        const totalDuration = loadedImages.length * secondsPerImage;
        setTimeout(() => {
          mediaRecorder.stop();
          
          // Clean up
          URL.revokeObjectURL(objectURL);
          videoElement.remove();
          
          // Combine recorded chunks
          const finalBlob = new Blob(chunks, { type: 'video/mp4' });
          
          console.log(`Video processing complete. Final video size: ${(finalBlob.size / (1024 * 1024)).toFixed(2)} MB`);
          resolve(finalBlob);
        }, totalDuration * 1000 + 500); // Add a small buffer
      });
    });
  } catch (error) {
    console.error('Error in processImagesIntoVideo:', error);
    if (toast) {
      toast({
        title: "Video Creation Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        variant: "destructive",
      });
    }
    return null;
  }
};

/**
 * Create a video segment for a single image
 */
const createImageSegment = async (image: HTMLImageElement, durationSeconds: number): Promise<Blob> => {
  return new Promise<Blob>(async (resolve) => {
    // Create a canvas for the image
    const canvas = document.createElement('canvas');
    canvas.width = 1280; 
    canvas.height = 720;
    const ctx = canvas.getContext('2d')!;
    
    // Draw the image centered on the canvas
    const imgRatio = image.width / image.height;
    const canvasRatio = canvas.width / canvas.height;
    
    let drawWidth, drawHeight, x, y;
    
    if (imgRatio > canvasRatio) {
      // Image is wider than canvas ratio
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      x = 0;
      y = (canvas.height - drawHeight) / 2;
    } else {
      // Image is taller than canvas ratio
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgRatio;
      x = (canvas.width - drawWidth) / 2;
      y = 0;
    }
    
    // Clear canvas with black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw the image
    ctx.drawImage(image, x, y, drawWidth, drawHeight);
    
    // Create a MediaRecorder for this segment
    const stream = canvas.captureStream();
    const recorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 5000000 // 5Mbps
    });
    
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };
    
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(blob);
    };
    
    // Start recording
    recorder.start();
    
    // Stop after exact duration
    setTimeout(() => {
      recorder.stop();
    }, durationSeconds * 1000);
  });
};
