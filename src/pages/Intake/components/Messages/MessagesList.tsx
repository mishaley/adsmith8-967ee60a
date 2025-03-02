
import React from "react";
import { Loader } from "lucide-react";
import { Message } from "./hooks/useMessagesFetching";

interface MessagesListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessagesList: React.FC<MessagesListProps> = ({ messages, isLoading }) => {
  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <Loader className="h-8 w-8 animate-spin mx-auto" />
        <div className="mt-4 text-gray-500">Generating messages...</div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        No messages available. Generate messages for this persona.
      </div>
    );
  }

  const getMessageTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      "0nocategory": "No Category",
      "1painpoint": "Pain Point",
      "2uniqueoffering": "Unique Offering",
      "3valueprop": "Value Proposition",
      "9clientprovided": "Client Provided"
    };
    return types[type] || type;
  };

  return (
    <div className="border rounded overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border-b px-4 py-2 text-left">Message</th>
            <th className="border-b px-4 py-2 text-left">Type</th>
            <th className="border-b px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message) => (
            <tr key={message.message_id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">{message.message_name}</td>
              <td className="px-4 py-3">{getMessageTypeLabel(message.message_type)}</td>
              <td className="px-4 py-3">{message.message_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MessagesList;
