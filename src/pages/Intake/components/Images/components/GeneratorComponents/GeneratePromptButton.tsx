
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader, MessageSquare } from "lucide-react";

interface GeneratePromptButtonProps {
  isGeneratingPrompt: boolean;
  handleGeneratePrompt: () => void;
  disabled: boolean;
}

export const GeneratePromptButton: React.FC<GeneratePromptButtonProps> = ({
  isGeneratingPrompt,
  handleGeneratePrompt,
  disabled
}) => {
  return (
    <Button 
      onClick={handleGeneratePrompt}
      disabled={isGeneratingPrompt || disabled}
      className="px-6 mb-4 w-full"
    >
      {isGeneratingPrompt ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          <span>Generating Prompt...</span>
        </>
      ) : (
        <>
          <MessageSquare className="mr-2 h-4 w-4" />
          Generate Prompt
        </>
      )}
    </Button>
  );
};
