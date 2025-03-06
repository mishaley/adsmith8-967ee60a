
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
  if (!column || !column.type || column.type === "remove") {
    return <td className="border p-1"></td>;
  }
  
  const personaKey = personaId || "default";
  
  console.log("MessageCell rendering:", {
    columnId: column.id,
    columnType: column.type,
    personaId: personaKey,
    content: column.content,
    messageData: column.content?.[personaKey]
  });
  
  // Check if we have valid content in the expected structure
  const messageData = column.content?.[personaKey];
  const hasContent = messageData && messageData.message_name;
  
  if (hasContent) {
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
