
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface MessageColumn {
  id: string;
  type: string;
  content?: Record<string, string>;
}

interface MessageCellProps {
  column: MessageColumn;
  onContentChange?: (columnId: string, personaId: string, content: string) => void;
  personaId?: string;
}

const MessageCell: React.FC<MessageCellProps> = ({ 
  column, 
  onContentChange,
  personaId = "default" // Use a default value if personaId is not provided
}) => {
  const content = column.content?.[personaId] || "";
  
  // If the message type is empty or "remove", don't render the textarea
  if (!column.type || column.type === "remove") {
    return <div className="h-[100px]"></div>;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onContentChange) {
      onContentChange(column.id, personaId, e.target.value);
    }
  };
  
  return (
    <Textarea
      value={content}
      onChange={handleChange}
      placeholder={`Add ${column.type} here...`}
      className="w-full min-h-[100px] resize-none border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
    />
  );
};

export default MessageCell;
