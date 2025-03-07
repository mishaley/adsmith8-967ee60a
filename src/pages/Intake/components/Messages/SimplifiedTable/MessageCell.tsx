
import React, { memo } from "react";

interface MessageColumn {
  id: string;
  type: string;
  content?: Record<string, any>;
}

interface MessageCellProps {
  column: MessageColumn;
  onContentChange?: (columnId: string, personaId: string, content: string) => void;
  personaId?: string;
}

const MessageCell: React.FC<MessageCellProps> = ({ 
  column, 
  onContentChange,
  personaId = "default"
}) => {
  // Skip rendering for empty or removed columns
  if (!column || !column.type || column.type === "remove") {
    return <td className="border p-1"></td>;
  }
  
  // Extract the message data for this persona from the column content
  const messageData = column.content?.[personaId]?.[column.type];
  
  // Check if we have a valid message with a message_name that's not empty
  if (messageData && messageData.message_name && messageData.message_name.trim() !== "") {
    return (
      <td className="border p-1 align-top">
        <div className="w-full min-h-[60px] p-2 bg-gray-50 rounded shadow-inner flex items-center justify-center">
          <span className="font-medium text-center text-gray-800">
            {messageData.message_name}
          </span>
        </div>
      </td>
    );
  }
  
  return (
    <td className="border p-1 align-top">
      <div className="w-full min-h-[60px] flex items-center justify-center text-gray-400 italic">
        Waiting for generation...
      </div>
    </td>
  );
};

export default memo(MessageCell);
