
import React from "react";
import { Persona } from "../Personas/types";
import { Message } from "../Messages/hooks/useMessagesFetching";
import MessagesOriginalContainer from "../Messages/MessagesContainer";

interface MessagesContainerProps {
  personas: Persona[];
  generatedMessages: Record<string, Record<string, Message>>;
  selectedMessageTypes: string[];
  handleUpdateMessages: (messages: Record<string, Record<string, Message>>, types: string[]) => void;
}

const MessagesContainer: React.FC<MessagesContainerProps> = ({
  personas,
  handleUpdateMessages
}) => {
  return (
    <MessagesOriginalContainer 
      personas={personas}
      onUpdateMessages={handleUpdateMessages}
    />
  );
};

export default MessagesContainer;
