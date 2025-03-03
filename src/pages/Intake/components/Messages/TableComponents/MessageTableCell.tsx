
import React, { useMemo } from "react";
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

  // Generate a random phrase for empty cells
  const randomPhrase = useMemo(() => {
    const adjectives = ["amazing", "perfect", "brilliant", "creative", "impressive", "incredible", "powerful"];
    const nouns = ["solution", "approach", "design", "strategy", "concept", "offering", "product", "service"];
    const verbs = ["delivers", "provides", "creates", "enhances", "transforms", "elevates"];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
    
    // 50% chance to include all three words or just adjective and noun
    const useAllThree = Math.random() > 0.5;
    
    return useAllThree 
      ? `${randomAdjective} ${randomNoun} ${randomVerb}` 
      : `${randomAdjective} ${randomNoun}`;
  }, [personaId, messageType]);

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
          <div className="flex items-center justify-center h-full text-sm text-gray-600">
            <span>{randomPhrase}</span>
          </div>
        )}
      </div>
    </td>
  );
};

export default MessageTableCell;
