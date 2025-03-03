
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
  // Check if we have a message for this persona and message type
  const hasMessage = 
    personaId && 
    generatedMessages[personaId] && 
    generatedMessages[personaId][messageType];

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
          <p>{messageContent}</p>
        ) : (
          <p className="text-gray-400">No message generated</p>
        )}
      </div>
    </td>
  );
};

export default MessageTableCell;
