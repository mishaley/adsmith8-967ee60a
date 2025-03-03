
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Persona } from "../../Personas/types";
import { useImageGeneration } from "../hooks/useImageGeneration";
import { ImagePreview } from "./GeneratorComponents/ImagePreview";
import { PromptDisplay } from "./GeneratorComponents/PromptDisplay";
import { ErrorDialog } from "./GeneratorComponents/ErrorDialog";

interface ImageGeneratorProps {
  currentPersona: Persona;
  adPlatform: string;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ 
  currentPersona, 
  adPlatform 
}) => {
  const { toast } = useToast();
  
  const {
    isGeneratingImages,
    isGeneratingPrompt,
    generatedImageUrl,
    generatedPrompt,
    errorDetails,
    showErrorDialog,
    handleGeneratePrompt,
    handleGenerateImages,
    setGeneratedPrompt,
    setShowErrorDialog
  } = useImageGeneration({ 
    currentPersona, 
    adPlatform, 
    toast 
  });

  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <PromptDisplay 
            generatedPrompt={generatedPrompt || ""}
            isGeneratingPrompt={isGeneratingPrompt}
            isGeneratingImages={isGeneratingImages}
            handleGeneratePrompt={handleGeneratePrompt}
            handleGenerateImages={handleGenerateImages}
            disabled={!generatedPrompt && !currentPersona}
          />
        </div>
        
        <div className="flex flex-col">
          <ImagePreview generatedImageUrl={generatedImageUrl} />
        </div>
      </div>
      
      {errorDetails && (
        <ErrorDialog 
          showErrorDialog={showErrorDialog}
          setShowErrorDialog={setShowErrorDialog}
          errorDetails={errorDetails}
          handleGenerateImages={handleGenerateImages}
        />
      )}
    </div>
  );
};

export default ImageGenerator;
