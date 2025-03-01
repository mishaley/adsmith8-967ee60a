
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export const useFileHandling = () => {
  const { toast } = useToast();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedImages(filesArray);
      
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

  const handleDownloadVideo = (url: string | null, format: 'webm' | 'mp4' = 'webm') => {
    if (!url) return;
    
    const fileExtension = format === 'webm' ? 'webm' : 'mp4';
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `image-slideshow.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Video Downloaded",
      description: `Your ${format.toUpperCase()} video has been downloaded successfully!`,
    });
  };

  return {
    selectedImages,
    previewImages,
    fileInputRef,
    handleImageSelect,
    triggerFileInput,
    handleDownloadVideo,
    setPreviewImages
  };
};
