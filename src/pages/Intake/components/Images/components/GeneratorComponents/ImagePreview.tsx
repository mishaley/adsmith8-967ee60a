
import React from "react";

interface ImagePreviewProps {
  generatedImageUrl: string | null;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ generatedImageUrl }) => {
  return (
    <div className="w-full aspect-square bg-gray-50 rounded-md border border-dashed border-gray-300 flex items-center justify-center">
      {generatedImageUrl ? (
        <img 
          src={generatedImageUrl} 
          alt="Generated persona image" 
          className="max-w-full max-h-full object-contain"
        />
      ) : (
        <span className="text-gray-400 text-center px-4">Images will appear here after generation</span>
      )}
    </div>
  );
};
