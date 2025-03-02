
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
  return (
    <div className="flex flex-wrap gap-2 mb-4 items-center">
      <Button 
        variant={selectedMessageTypes.includes("pain-point") ? "default" : "outline"} 
        size="sm" 
        onClick={() => toggleMessageType("pain-point")}
        className={`transition-all duration-300 ${!isLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!isLoaded}
      >
        Pain Point
      </Button>
      <Button 
        variant={selectedMessageTypes.includes("unique-offering") ? "default" : "outline"} 
        size="sm" 
        onClick={() => toggleMessageType("unique-offering")}
        className={`transition-all duration-300 ${!isLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!isLoaded}
      >
        Unique Offering
      </Button>
      <Button 
        variant={selectedMessageTypes.includes("value-prop") ? "default" : "outline"} 
        size="sm" 
        onClick={() => toggleMessageType("value-prop")}
        className={`transition-all duration-300 ${!isLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!isLoaded}
      >
        Value Prop
      </Button>
      <Button 
        variant={selectedMessageTypes.includes("user-provided") ? "default" : "outline"} 
        size="sm" 
        onClick={() => toggleMessageType("user-provided")}
        className={`transition-all duration-300 ${!isLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!isLoaded}
      >
        User Provided
      </Button>
    </div>
  );
};

export default MessageTypeSelector;
