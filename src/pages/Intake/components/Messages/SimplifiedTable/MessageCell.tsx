
import React, { memo } from "react";

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
  
  // If column has content for this persona, display it
  if (content) {
    return (
      <td className="border p-1 align-top">
        <div className="w-full min-h-[60px] p-2 bg-white">
          {content}
        </div>
      </td>
    );
  }
  
  // If no content, just show an empty cell
  return (
    <td className="border p-1 align-top"></td>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(MessageCell);
