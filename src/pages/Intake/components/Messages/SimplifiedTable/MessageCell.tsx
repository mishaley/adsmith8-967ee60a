
import React, { memo, useEffect } from "react";

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
  
  useEffect(() => {
    console.log("MessageCell mounted/updated for:", {
      columnId: column.id,
      columnType: column.type,
      personaId,
      hasContent: column.content ? "yes" : "no",
      contentKeys: column.content ? Object.keys(column.content) : [],
    });
  }, [column, personaId]);
  
  // Extract the message data for this persona from the column content
  const messageData = column.content?.[personaId];
  
  console.log("MessageCell data check:", {
    personaId,
    columnType: column.type,
    messageData: messageData ? JSON.stringify(messageData).substring(0, 100) : "undefined",
    hasMessageName: messageData?.message_name ? "yes" : "no",
    messageNameValue: messageData?.message_name || "empty"
  });
  
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
