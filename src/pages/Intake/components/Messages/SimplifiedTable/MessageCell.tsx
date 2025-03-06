
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
  
  // Make sure we have a valid personaId
  const personaKey = personaId || "default";
  
  // Check if column has content for this persona
  const hasContent = column.content && 
                    column.content[personaKey] && 
                    column.content[personaKey].trim() !== "";
  
  if (hasContent) {
    // Display the content if it exists
    return (
      <td className="border p-1 align-top">
        <div className="w-full min-h-[60px] p-2 bg-gray-50 rounded shadow-inner flex items-center justify-center">
          <span className="font-medium text-center text-gray-800">
            {column.content?.[personaKey]}
          </span>
        </div>
      </td>
    );
  }
  
  // If no content, show the waiting message
  return (
    <td className="border p-1 align-top">
      <div className="w-full min-h-[60px] flex items-center justify-center text-gray-400 italic">
        Waiting for generation...
      </div>
    </td>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(MessageCell);
