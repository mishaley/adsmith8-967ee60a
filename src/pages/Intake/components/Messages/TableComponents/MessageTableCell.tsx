
import React from "react";
import { Loader } from "lucide-react";
import { Message } from "../hooks/useMessagesFetching";

interface MessageTableCellProps {
  personaId: string;
  messageType: string;
  isLoading: boolean;
  generatedMessages: Record<string, Record<string, Message>>;
}

const MessageTableCell: React.FC<MessageTableCellProps> = ({
  personaId,
  messageType,
  isLoading,
  generatedMessages
}) => {
  // Add more comprehensive debug logging
  console.log(`MessageTableCell for personaId=${personaId}, type=${messageType}:`, { 
    personaIdType: typeof personaId,
    hasPersonaMessages: personaId && generatedMessages[personaId] ? true : false,
    availablePersonas: Object.keys(generatedMessages),
    availableMessageTypes: personaId && generatedMessages[personaId] 
      ? Object.keys(generatedMessages[personaId]) 
      : []
  });

  if (isLoading) {
    return (
      <td className="border p-2 align-top">
        <div className="flex items-center justify-center h-16">
          <Loader className="h-4 w-4 animate-spin" />
        </div>
      </td>
    );
  }

  // Check if we have valid data for this cell
  const hasData = 
    personaId && 
    generatedMessages[personaId] && 
    generatedMessages[personaId][messageType] &&
    generatedMessages[personaId][messageType].message_name;
  
  // Get the message content only if all the required properties exist
  const messageContent = hasData ? generatedMessages[personaId][messageType].message_name : null;

  return (
    <td className="border p-2 align-top">
      <div className="min-h-[60px]">
        {messageContent ? (
          <p className="text-sm">{messageContent}</p>
        ) : (
          <p className="text-gray-400 text-sm">No message generated</p>
        )}
      </div>
    </td>
  );
};

export default MessageTableCell;
