
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { toast } from "sonner";

interface MessageTableHeaderProps {
  messageType: string;
  getMessageTypeLabel: (type: string) => string;
  onGenerateColumnMessages: (messageType: string) => Promise<void>;
  isGeneratingMessages: boolean;
}

const MessageTableHeader: React.FC<MessageTableHeaderProps> = ({
  messageType,
  getMessageTypeLabel,
  onGenerateColumnMessages,
  isGeneratingMessages
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateClick = async () => {
    if (isGenerating || isGeneratingMessages) return;
    
    try {
      setIsGenerating(true);
      console.log(`Starting generation for ${messageType}`);
      await onGenerateColumnMessages(messageType);
      console.log(`Generation completed for ${messageType}`);
      
      toast.success(`Generated messages for ${getMessageTypeLabel(messageType)}`);
    } catch (error) {
      console.error(`Error generating ${messageType} messages:`, error);
      toast.error(`Failed to generate messages for ${getMessageTypeLabel(messageType)}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <th key={messageType} className="border p-2 text-left">
      <div className="flex items-center gap-2">
        <span>{getMessageTypeLabel(messageType)}</span>
        <Button 
          variant="outline" 
          size="sm" 
          className="py-0 px-2 h-6 text-xs"
          onClick={handleGenerateClick}
          disabled={isGeneratingMessages || isGenerating}
        >
          {(isGenerating || isGeneratingMessages) ? (
            <>
              <Loader className="mr-1 h-3 w-3 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
    </th>
  );
};

export default MessageTableHeader;
