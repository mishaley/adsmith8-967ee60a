
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface MessageTableHeaderProps {
  messageType: string;
  getMessageTypeLabel: (type: string) => string;
  onGenerateColumnMessages: (messageType: string) => void;
  isGeneratingMessages: boolean;
}

const MessageTableHeader: React.FC<MessageTableHeaderProps> = ({
  messageType,
  getMessageTypeLabel,
  onGenerateColumnMessages,
  isGeneratingMessages
}) => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  
  const handleGenerateClick = async () => {
    try {
      setIsGenerating(true);
      await onGenerateColumnMessages(messageType);
    } finally {
      // Ensure we reset the loading state even if there's an error
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
          {isGenerating ? (
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
