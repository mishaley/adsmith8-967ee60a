
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

  const buttonStyles = (isSelected: boolean) => 
    cn("transition-all duration-300", 
      isSelected ? "bg-[#0c343d] text-white hover:bg-[#0c343d]/90" : "");

  return (
    <div className="flex flex-wrap gap-2 items-start">
      <Button 
        variant={selectedMessageTypes.includes("pain-point") ? "default" : "outline"} 
        size="sm" 
        onClick={(e) => handleButtonClick("pain-point", e)}
        className={buttonStyles(selectedMessageTypes.includes("pain-point"))}
        disabled={!isLoaded}
      >
        Pain Point
      </Button>
      <Button 
        variant={selectedMessageTypes.includes("unique-offering") ? "default" : "outline"} 
        size="sm" 
        onClick={(e) => handleButtonClick("unique-offering", e)}
        className={buttonStyles(selectedMessageTypes.includes("unique-offering"))}
        disabled={!isLoaded}
      >
        Unique Offering
      </Button>
      <Button 
        variant={selectedMessageTypes.includes("value-prop") ? "default" : "outline"} 
        size="sm" 
        onClick={(e) => handleButtonClick("value-prop", e)}
        className={buttonStyles(selectedMessageTypes.includes("value-prop"))}
        disabled={!isLoaded}
      >
        Value Prop
      </Button>
      <Button 
        variant={selectedMessageTypes.includes("user-provided") ? "default" : "outline"} 
        size="sm" 
        onClick={(e) => handleButtonClick("user-provided", e)}
        className={cn(
          buttonStyles(selectedMessageTypes.includes("user-provided")),
          selectedMessageTypes.includes("user-provided") ? 'rounded-r-none border-r-0 z-10' : ''
        )}
        disabled={!isLoaded}
      >
        User Provided
      </Button>
    </div>
  );
};

export default MessageTypeSelector;
