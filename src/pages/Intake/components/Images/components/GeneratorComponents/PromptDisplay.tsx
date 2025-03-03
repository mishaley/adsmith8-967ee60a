
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Loader } from "lucide-react";

interface PromptDisplayProps {
  generatedPrompt: string;
  styleSource: string;
  isGeneratingPrompt: boolean;
  isGeneratingImages: boolean;
  handleGeneratePrompt: () => void;
  handleGenerateImages: () => void;
  disabled: boolean;
}

export const PromptDisplay: React.FC<PromptDisplayProps> = ({
  generatedPrompt,
  styleSource,
  isGeneratingPrompt,
  isGeneratingImages,
  handleGeneratePrompt,
  handleGenerateImages,
  disabled
}) => {
  return (
    <div className="mb-4 w-full">
      <div className="flex flex-col mb-2">
        <Textarea 
          value={generatedPrompt}
          readOnly
          className="min-h-32 mb-2 font-mono text-sm"
        />
        {styleSource === "default" && (
          <div className="text-xs text-yellow-600 mb-1">
            * Using default style (no approved styles found in database)
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={handleGeneratePrompt} 
          variant="outline"
          size="sm"
          disabled={isGeneratingPrompt}
          className="w-1/2"
        >
          {isGeneratingPrompt ? (
            <>
              <Loader className="mr-2 h-3 w-3 animate-spin" />
              <span>Regenerate</span>
            </>
          ) : (
            "Regenerate Prompt"
          )}
        </Button>
        <Button 
          onClick={handleGenerateImages} 
          disabled={isGeneratingImages || disabled}
          className="w-1/2"
          size="sm"
        >
          {isGeneratingImages ? (
            <>
              <Loader className="mr-2 h-3 w-3 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Image className="mr-2 h-3 w-3" />
              Generate Image
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
