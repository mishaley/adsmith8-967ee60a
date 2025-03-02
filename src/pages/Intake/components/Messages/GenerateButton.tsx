
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface GenerateButtonProps {
  isGeneratingMessages: boolean;
  selectedMessageTypes: string[];
  isLoaded: boolean;
  generateMessages: () => Promise<void>;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({
  isGeneratingMessages,
  selectedMessageTypes,
  isLoaded,
  generateMessages
}) => {
  return (
    <div className="mb-4">
      <Button 
        onClick={generateMessages} 
        disabled={isGeneratingMessages || selectedMessageTypes.length === 0 || !isLoaded}
        className={`transition-all duration-300 ${!isLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isGeneratingMessages ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : "Generate"}
      </Button>
    </div>
  );
};

export default GenerateButton;
