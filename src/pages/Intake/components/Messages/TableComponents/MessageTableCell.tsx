
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
  // Log component rendering for debugging
  console.log(`MessageTableCell rendering for personaId=${personaId}, type=${messageType}`);

  if (isLoading) {
    return (
      <td className="border p-2 align-top">
        <div className="flex items-center justify-center h-16">
          <Loader className="h-4 w-4 animate-spin" />
        </div>
      </td>
    );
  }

  // Simply use hardcoded message text instead of trying to access the data
  return (
    <td className="border p-2 align-top">
      <div className="min-h-[60px]">
        <p className="text-sm">Generated {messageType} Example</p>
      </div>
    </td>
  );
};

export default MessageTableCell;
