
import React from "react";
import { Button } from "@/components/ui/button";

interface MessageTypeSelectorProps {
  selectedMessageTypes: string[];
  toggleMessageType: (type: string) => void;
  isLoaded: boolean;
}

const MessageTypeSelector: React.FC<MessageTypeSelectorProps> = ({
  selectedMessageTypes,
  toggleMessageType,
  isLoaded
}) => {
  // Function to handle button click with proper event handling
  const handleButtonClick = (type: string, e: React.MouseEvent) => {
    e.preventDefault();
    toggleMessageType(type);
  };

  return (
    <div className="flex flex-wrap gap-2 items-start">
      <Button 
        variant={selectedMessageTypes.includes("pain-point") ? "default" : "outline"} 
        size="sm" 
        onClick={(e) => handleButtonClick("pain-point", e)}
        className="transition-all duration-300"
        disabled={!isLoaded}
      >
        Pain Point
      </Button>
      <Button 
        variant={selectedMessageTypes.includes("unique-offering") ? "default" : "outline"} 
        size="sm" 
        onClick={(e) => handleButtonClick("unique-offering", e)}
        className="transition-all duration-300"
        disabled={!isLoaded}
      >
        Unique Offering
      </Button>
      <Button 
        variant={selectedMessageTypes.includes("value-prop") ? "default" : "outline"} 
        size="sm" 
        onClick={(e) => handleButtonClick("value-prop", e)}
        className="transition-all duration-300"
        disabled={!isLoaded}
      >
        Value Prop
      </Button>
      <Button 
        variant={selectedMessageTypes.includes("user-provided") ? "default" : "outline"} 
        size="sm" 
        onClick={(e) => handleButtonClick("user-provided", e)}
        className={`transition-all duration-300 ${selectedMessageTypes.includes("user-provided") ? 'rounded-r-none border-r-0 z-10' : ''}`}
        disabled={!isLoaded}
      >
        User Provided
      </Button>
    </div>
  );
};

export default MessageTypeSelector;
