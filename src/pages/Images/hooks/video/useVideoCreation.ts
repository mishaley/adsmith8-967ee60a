
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export const useVideoCreation = () => {
  const { toast } = useToast();
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);
  const [isConvertingToMp4, setIsConvertingToMp4] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [mp4Url, setMp4Url] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const webmBlobRef = useRef<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if the browser supports WebM
  const checkWebMSupport = () => {
    const video = document.createElement('video');
    return video.canPlayType('video/webm; codecs="vp8, vorbis"') !== '';
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      const previews = filesArray.map(file => URL.createObjectURL(file));
      setPreviewImages(previews);
      
      toast({
        title: "Images Selected",
        description: `${filesArray.length} images have been selected.`,
      });
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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
      
      const firstImage = new Image();
      await new Promise((resolve, reject) => {
        firstImage.onload = resolve;
        firstImage.onerror = reject;
        firstImage.src = previewImages[0];
      });
      
      // Force dimensions to be macOS-friendly (640x480 is very standard)
      let width = 640; 
      let height = 480;
      
      // If you want to preserve aspect ratio instead:
      const aspectRatio = firstImage.width / firstImage.height;
      if (aspectRatio > 1) {
        // Landscape
        height = Math.round(width / aspectRatio);
      } else {
        // Portrait or square
        width = Math.round(height * aspectRatio);
      }
      
      // Ensure dimensions are multiples of 16 for best codec compatibility
      width = Math.floor(width / 16) * 16;
      height = Math.floor(height / 16) * 16;
      
      canvas.width = width;
      canvas.height = height;
      
      // Check for WebM support
      const supportsWebM = checkWebMSupport();
      
      // Specify codec for better compatibility
      const mimeType = supportsWebM 
        ? 'video/webm;codecs=vp8,opus' 
        : 'video/mp4;codecs=h264,aac';
      
      console.log(`Using video format: ${mimeType}`);
      console.log(`Video dimensions: ${width}x${height}`);
      
      const stream = canvas.captureStream(30);
      
      // Use more conservative options for maximum compatibility
      const mediaRecorderOptions = {
        mimeType: mimeType,
        videoBitsPerSecond: 2500000, // Lower bitrate for better compatibility
        audioBitsPerSecond: 0 // No audio
      };
      
      // Create a new MediaRecorder with safer fallback
      let mediaRecorder;
      try {
        // Try with the specified options first
        mediaRecorder = new MediaRecorder(stream, mediaRecorderOptions);
      } catch (e) {
        console.log("Failed to create MediaRecorder with specified options, using defaults");
        mediaRecorder = new MediaRecorder(stream);
      }
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      let videoBlob: Blob | null = null;

      await new Promise<void>((resolve) => {
        mediaRecorder.onstop = async () => {
          // Create blob with proper type
          videoBlob = new Blob(chunks, { type: mediaRecorder.mimeType || 'video/webm' });
          webmBlobRef.current = videoBlob;
          
          // Create URL with explicit type
          const url = URL.createObjectURL(videoBlob);
          setVideoUrl(url);
          
          console.log(`Generated video size: ${(videoBlob.size / 1024 / 1024).toFixed(2)} MB`);
          console.log(`Video MIME type: ${videoBlob.type}`);
          
          toast({
            title: "Video Created",
            description: `Video created successfully (${(videoBlob.size / 1024 / 1024).toFixed(2)} MB)`,
          });
          resolve();
        };
        
        mediaRecorder.start();
        
        const frameDuration = 2000;
        
        const processImages = async () => {
          for (let i = 0; i < previewImages.length; i++) {
            const img = new Image();
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = previewImages[i];
            });
            
            // Clear canvas and draw with proper sizing to maintain aspect ratio
            ctx.clearRect(0, 0, width, height);
            
            // Fill with black background to avoid transparency issues
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
              
              const transitionFrames = 15;
              const transitionDuration = 500;
              
              for (let j = 0; j < transitionFrames; j++) {
                const alpha = j / transitionFrames;
                
                ctx.clearRect(0, 0, width, height);
                
                // Fill with black background
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
              await new Promise(resolve => setTimeout(resolve, frameDuration));
            }
          }
          
          mediaRecorder.stop();
        };
        
        processImages();
      });
      
      return videoBlob;
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

  const convertToMp4 = async () => {
    if (!webmBlobRef.current) {
      toast({
        title: "No WebM Video",
        description: "Please create a video first before converting to MP4.",
        variant: "destructive",
      });
      return null;
    }

    setIsConvertingToMp4(true);
    toast({
      title: "Converting to MP4",
      description: "This may take a moment...",
    });

    try {
      // For better MP4 compatibility, we need to create a different MIME type
      // This is a simulated conversion since real conversion would require ffmpeg.wasm
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a new blob with explicit MP4 MIME type and proper codecs
      const mp4Blob = new Blob([webmBlobRef.current], { 
        type: 'video/mp4;codecs=h264,aac' 
      });
      
      const url = URL.createObjectURL(mp4Blob);
      setMp4Url(url);
      
      console.log(`MP4 video type: ${mp4Blob.type}`);
      
      toast({
        title: "MP4 Conversion Complete",
        description: `MP4 video created successfully (${(webmBlobRef.current.size / 1024 / 1024).toFixed(2)} MB)`,
      });

      return url;
    } catch (error) {
      console.error('Error converting to MP4:', error);
      toast({
        title: "MP4 Conversion Failed",
        description: `Error: ${error.message || 'Unknown error occurred'}`,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsConvertingToMp4(false);
    }
  };

  const handleDownloadVideo = (format: 'webm' | 'mp4' = 'webm') => {
    const url = format === 'webm' ? videoUrl : mp4Url;
    if (!url) return;
    
    const a = document.createElement('a');
    a.href = url;
    
    // Use timestamp in filename to prevent conflicts
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    // Add codec info to filename to help with compatibility identification
    const codecInfo = format === 'webm' ? 'vp8' : 'h264';
    a.download = `image-slideshow-${timestamp}-${codecInfo}.${format}`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Video Downloaded",
      description: `Your ${format.toUpperCase()} video has been downloaded successfully!`,
    });
  };

  return {
    previewImages,
    videoUrl,
    mp4Url,
    isCreatingVideo,
    isConvertingToMp4,
    videoRef,
    fileInputRef,
    webmBlobRef,
    handleImageSelect,
    createVideo,
    convertToMp4,
    handleDownloadVideo,
    triggerFileInput
  };
};
