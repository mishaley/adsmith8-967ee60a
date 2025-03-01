
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export const useImageSelection = () => {
  const { toast } = useToast();
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      if (filesArray.length > 0) {
        // Clean up any previous URLs to prevent memory leaks
        previewImages.forEach(url => {
          if (url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
        
        // Create new object URLs
        const previews = filesArray.map(file => URL.createObjectURL(file));
        setPreviewImages(previews);
        
        toast({
          title: "Images Selected",
          description: `${filesArray.length} images have been selected.`,
        });
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return {
    previewImages,
    fileInputRef,
    handleImageSelect,
    triggerFileInput,
    setPreviewImages
  };
};
