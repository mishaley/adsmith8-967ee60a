
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Persona } from "../../Personas/types";
import { GeneratePromptButton } from "./GeneratorComponents/GeneratePromptButton";
import { PromptDisplay } from "./GeneratorComponents/PromptDisplay";
import { GenerateImageButton } from "./GeneratorComponents/GenerateImageButton";
import { ImagePreview } from "./GeneratorComponents/ImagePreview";
import { ErrorDialog } from "./GeneratorComponents/ErrorDialog";
import { useImageGeneration } from "../hooks/useImageGeneration";

interface ImageGeneratorProps {
  currentPersona: Persona | null;
  adPlatform: string;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ currentPersona, adPlatform }) => {
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
  } = useImageGeneration({ currentPersona, adPlatform, toast });
  
  return (
    <div className="flex flex-col items-center min-h-52">
      <div className="mb-4 w-full">
        {!generatedPrompt ? (
          <GeneratePromptButton 
            isGeneratingPrompt={isGeneratingPrompt}
            handleGeneratePrompt={handleGeneratePrompt}
            disabled={!currentPersona}
          />
        ) : (
          <PromptDisplay 
            generatedPrompt={generatedPrompt}
            isGeneratingPrompt={isGeneratingPrompt}
            isGeneratingImages={isGeneratingImages}
            handleGeneratePrompt={handleGeneratePrompt}
            handleGenerateImages={handleGenerateImages}
            disabled={!adPlatform}
          />
        )}
        
        {!generatedPrompt && (
          <GenerateImageButton 
            isGeneratingImages={isGeneratingImages}
            handleGenerateImages={handleGenerateImages}
            disabled={!adPlatform}
          />
        )}
      </div>
      
      <ImagePreview generatedImageUrl={generatedImageUrl} />

      <ErrorDialog 
        showErrorDialog={showErrorDialog}
        setShowErrorDialog={setShowErrorDialog}
        errorDetails={errorDetails}
        handleGenerateImages={handleGenerateImages}
      />
    </div>
  );
};

export default ImageGenerator;
