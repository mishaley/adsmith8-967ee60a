
import React from "react";
import { Button } from "@/components/ui/button";

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
  return (
    <th key={messageType} className="border p-2 text-left">
      <div className="flex items-center gap-2">
        <span>{getMessageTypeLabel(messageType)}</span>
        <Button 
          variant="outline" 
          size="sm" 
          className="py-0 px-2 h-6 text-xs"
          onClick={() => onGenerateColumnMessages(messageType)}
          disabled={isGeneratingMessages}
        >
          Generate
        </Button>
      </div>
    </th>
  );
};

export default MessageTableHeader;
