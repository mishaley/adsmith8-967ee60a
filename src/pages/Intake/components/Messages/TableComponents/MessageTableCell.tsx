
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
  // Debug logging
  const hasPersona = !!personaId && !!generatedMessages[personaId];
  const hasMessage = hasPersona && !!generatedMessages[personaId][messageType];
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`MessageTableCell: personaId=${personaId}, messageType=${messageType}`);
    console.log(`Has persona data: ${hasPersona}, Has message: ${hasMessage}`);
    if (hasPersona && generatedMessages[personaId]) {
      console.log(`Available message types for persona:`, Object.keys(generatedMessages[personaId]));
    }
  }

  // Check if we have a message for this persona and message type
  const messageContent = hasMessage ? generatedMessages[personaId][messageType].message_name : null;

  if (isLoading) {
    return (
      <td className="border p-2 align-top">
        <div className="flex items-center justify-center h-16">
          <Loader className="h-4 w-4 animate-spin" />
        </div>
      </td>
    );
  }

  return (
    <td className="border p-2 align-top">
      <div>
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
