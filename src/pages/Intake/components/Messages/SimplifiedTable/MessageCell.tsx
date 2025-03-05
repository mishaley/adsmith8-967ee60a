
import React, { memo } from "react";
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
  // Safeguard against invalid or empty columns
  if (!column || !column.type || column.type === "remove") {
    return <td className="border p-1"></td>;
  }
  
  // Safely access content with null checks
  const content = column.content && personaId ? column.content[personaId] || "" : "";
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onContentChange && personaId) {
      onContentChange(column.id, personaId, e.target.value);
    }
  };
  
  return (
    <td className="border p-1 align-top">
      <Textarea
        value={content}
        onChange={handleChange}
        placeholder={`Add ${column.type} here...`}
        className="w-full resize-none border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
        style={{ minHeight: "80px", maxHeight: "120px" }}
      />
    </td>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(MessageCell);
