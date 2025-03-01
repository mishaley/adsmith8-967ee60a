
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export const useVideoCreator = () => {
  const { toast } = useToast();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedImages(filesArray);
      
      const previews = filesArray.map(file => URL.createObjectURL(file));
      setPreviewImages(previews);
      
      setVideoUrl(null);
      
      toast({
        title: "Images Selected",
        description: `${filesArray.length} images have been selected.`,
      });
    }
  };

  const createVideo = async () => {
    if (selectedImages.length === 0) {
      toast({
        title: "No Images Selected",
        description: "Please select at least one image to create a video.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingVideo(true);
    
    try {
      // Create a temporary canvas to get image dimensions
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error("Unable to create canvas context");
      }
      
      // Load the first image to set dimensions
      const firstImage = new Image();
      await new Promise((resolve, reject) => {
        firstImage.onload = resolve;
        firstImage.onerror = reject;
        firstImage.src = previewImages[0];
      });
      
      // Set canvas dimensions to match the image
      const width = firstImage.width;
      const height = firstImage.height;
      canvas.width = width;
      canvas.height = height;
      
      // Use a more universally compatible codec and container
      // WebM with VP8 is more widely supported than VP9
      const mimeType = 'video/webm';
      
      // Configure stream with good compatibility
      const stream = canvas.captureStream(30); // 30fps for smoother transitions
      
      // Use MediaRecorder with more compatible settings
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType,
        videoBitsPerSecond: 8000000 // 8 Mbps for better quality but still compatible
      });
      
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        // Create video file with standard WebM container
        const videoBlob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(videoBlob);
        setVideoUrl(url);
        setIsCreatingVideo(false);
        
        console.log(`Generated video size: ${(videoBlob.size / 1024 / 1024).toFixed(2)} MB`);
        
        toast({
          title: "Video Created",
          description: `Video created successfully (${(videoBlob.size / 1024 / 1024).toFixed(2)} MB)`,
        });
      };
      
      mediaRecorder.start();
      
      // Increase the frame duration for better quality per frame
      const frameDuration = 2000; // 2 seconds per image
      
      // Process each image
      for (let i = 0; i < previewImages.length; i++) {
        // Load the image
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = previewImages[i];
        });
        
        // Clear canvas and draw the current image
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
        // For smoother transitions, add a small fade effect
        if (i < previewImages.length - 1) {
          // Wait for the frame duration
          await new Promise(resolve => setTimeout(resolve, frameDuration));
          
          // Load the next image
          const nextImg = new Image();
          await new Promise((resolve, reject) => {
            nextImg.onload = resolve;
            nextImg.onerror = reject;
            nextImg.src = previewImages[i + 1];
          });
          
          // Create a cross-fade transition (optional)
          // This is a simple fade transition - can be enhanced further
          const transitionFrames = 15; // Number of transition frames
          const transitionDuration = 500; // 500ms transition
          
          for (let j = 0; j < transitionFrames; j++) {
            const alpha = j / transitionFrames;
            
            // Clear canvas
            ctx.clearRect(0, 0, width, height);
            
            // Draw current image
            ctx.globalAlpha = 1 - alpha;
            ctx.drawImage(img, 0, 0, width, height);
            
            // Draw next image with increasing opacity
            ctx.globalAlpha = alpha;
            ctx.drawImage(nextImg, 0, 0, width, height);
            
            // Reset alpha
            ctx.globalAlpha = 1;
            
            // Wait a small amount for the transition frame
            await new Promise(resolve => 
              setTimeout(resolve, transitionDuration / transitionFrames)
            );
          }
        } else {
          // For the last image, just display it for the full duration
          await new Promise(resolve => setTimeout(resolve, frameDuration));
        }
      }
      
      // Stop recording after all images have been processed
      mediaRecorder.stop();
      
    } catch (error) {
      console.error('Error creating video:', error);
      setIsCreatingVideo(false);
      toast({
        title: "Video Creation Failed",
        description: `Error: ${error.message || 'Unknown error occurred'}`,
        variant: "destructive",
      });
    }
  };

  const handleDownloadVideo = () => {
    if (!videoUrl) return;
    
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = 'image-slideshow.webm'; // Changed to .webm to match the actual format
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Video Downloaded",
      description: "Your video has been downloaded successfully!",
    });
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return {
    selectedImages,
    previewImages,
    videoUrl,
    isCreatingVideo,
    videoRef,
    fileInputRef,
    handleImageSelect,
    createVideo,
    handleDownloadVideo,
    triggerFileInput
  };
};
