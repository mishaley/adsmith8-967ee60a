
import React from "react";
import { Button } from "@/components/ui/button";
import { Image, Loader } from "lucide-react";

interface GenerateImageButtonProps {
  isGeneratingImages: boolean;
  handleGenerateImages: () => void;
  disabled: boolean;
}

export const GenerateImageButton: React.FC<GenerateImageButtonProps> = ({
  isGeneratingImages,
  handleGenerateImages,
  disabled
}) => {
  return (
    <Button 
      onClick={handleGenerateImages} 
      disabled={isGeneratingImages || disabled}
      className="px-6 w-full"
    >
      {isGeneratingImages ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <Image className="mr-2 h-4 w-4" />
          Generate Image
        </>
      )}
    </Button>
  );
};
