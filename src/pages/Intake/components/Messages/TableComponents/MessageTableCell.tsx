
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
  // Get the message content if it exists
  const message = generatedMessages[personaId]?.[messageType];
  const hasContent = message && (message.content || message.message_name);

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
      <div className="min-h-[60px]">
        {hasContent ? (
          <p className="text-sm">{message.content || message.message_name}</p>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            <span>Click "Generate" in header to create content</span>
          </div>
        )}
      </div>
    </td>
  );
};

export default MessageTableCell;
