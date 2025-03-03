
import React from "react";
import { Persona } from "../Personas/types";
import MessagesSection from "./MessagesSection";
import { Message } from "./hooks/useMessagesFetching";

interface MessagesContainerProps {
  personas: Persona[];
  onUpdateMessages?: (generatedMessages: Record<string, Record<string, Message>>, selectedTypes: string[]) => void;
}

const MessagesContainer: React.FC<MessagesContainerProps> = ({ 
  personas,
  onUpdateMessages
}) => {
  return (
    <div className="bg-[#e9f2fe] p-4 mb-6 rounded-lg">
      <h2 className="text-center text-gray-700 mb-4 font-bold text-xl">MESSAGES</h2>
      <MessagesSection 
        personas={personas}
        onUpdateMessages={onUpdateMessages}
      />
    </div>
  );
};

export default MessagesContainer;
