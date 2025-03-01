import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export const useVideoCreator = () => {
  const { toast } = useToast();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [mp4Url, setMp4Url] = useState<string | null>(null);
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);
  const [isConvertingToMp4, setIsConvertingToMp4] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const webmBlobRef = useRef<Blob | null>(null);

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
      
      const width = firstImage.width;
      const height = firstImage.height;
      canvas.width = width;
      canvas.height = height;
      
      const mimeType = 'video/webm';
      
      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType,
        videoBitsPerSecond: 8000000
      });
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const videoBlob = new Blob(chunks, { type: mimeType });
        webmBlobRef.current = videoBlob;
        const url = URL.createObjectURL(videoBlob);
        setVideoUrl(url);
        setIsCreatingVideo(false);
        setMp4Url(null);
        
        console.log(`Generated video size: ${(videoBlob.size / 1024 / 1024).toFixed(2)} MB`);
        
        toast({
          title: "Video Created",
          description: `Video created successfully (${(videoBlob.size / 1024 / 1024).toFixed(2)} MB)`,
        });
      };
      
      mediaRecorder.start();
      
      const frameDuration = 2000;
      
      for (let i = 0; i < previewImages.length; i++) {
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = previewImages[i];
        });
        
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
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
            ctx.globalAlpha = 1 - alpha;
            ctx.drawImage(img, 0, 0, width, height);
            ctx.globalAlpha = alpha;
            ctx.drawImage(nextImg, 0, 0, width, height);
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

  const loadFFmpeg = async () => {
    if (ffmpegRef.current) return ffmpegRef.current;

    const ffmpeg = new FFmpeg();
    ffmpegRef.current = ffmpeg;

    try {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      return ffmpeg;
    } catch (error) {
      console.error('Error loading FFmpeg:', error);
      throw new Error('Failed to load FFmpeg');
    }
  };

  const convertToMp4 = async () => {
    if (!webmBlobRef.current) {
      toast({
        title: "No WebM Video",
        description: "Please create a video first before converting to MP4.",
        variant: "destructive",
      });
      return;
    }

    setIsConvertingToMp4(true);
    toast({
      title: "Converting to MP4",
      description: "This may take a moment...",
    });

    try {
      const ffmpeg = await loadFFmpeg();
      
      await ffmpeg.writeFile('input.webm', await fetchFile(webmBlobRef.current));
      
      await ffmpeg.exec([
        '-i', 'input.webm',
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '22',
        '-pix_fmt', 'yuv420p',
        'output.mp4'
      ]);
      
      const data = await ffmpeg.readFile('output.mp4');
      const mp4Blob = new Blob([data], { type: 'video/mp4' });
      const url = URL.createObjectURL(mp4Blob);
      setMp4Url(url);
      
      toast({
        title: "MP4 Conversion Complete",
        description: `MP4 video created successfully (${(mp4Blob.size / 1024 / 1024).toFixed(2)} MB)`,
      });
    } catch (error) {
      console.error('Error converting to MP4:', error);
      toast({
        title: "MP4 Conversion Failed",
        description: `Error: ${error.message || 'Unknown error occurred'}`,
        variant: "destructive",
      });
    } finally {
      setIsConvertingToMp4(false);
    }
  };

  const handleDownloadVideo = (format: 'webm' | 'mp4' = 'webm') => {
    const urlToDownload = format === 'webm' ? videoUrl : mp4Url;
    const fileExtension = format === 'webm' ? 'webm' : 'mp4';
    
    if (!urlToDownload) return;
    
    const a = document.createElement('a');
    a.href = urlToDownload;
    a.download = `image-slideshow.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Video Downloaded",
      description: `Your ${format.toUpperCase()} video has been downloaded successfully!`,
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
    mp4Url,
    isCreatingVideo,
    isConvertingToMp4,
    videoRef,
    fileInputRef,
    handleImageSelect,
    createVideo,
    convertToMp4,
    handleDownloadVideo,
    triggerFileInput
  };
};
