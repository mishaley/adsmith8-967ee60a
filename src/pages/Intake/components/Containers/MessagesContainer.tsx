
import React from "react";
import { Persona } from "../Personas/types";
import { Message } from "../Messages/hooks/useMessagesFetching";
import MessagesOriginalContainer from "../Messages/MessagesContainer";

interface MessagesContainerProps {
  personas: Persona[];
  generatedMessages: Record<string, Record<string, Message>>;
  selectedMessageTypes: string[];
  handleUpdateMessages: (messages: Record<string, Record<string, Message>>, types: string[]) => void;
  isSegmented?: boolean;
}

const MessagesContainer: React.FC<MessagesContainerProps> = ({
  personas,
  generatedMessages,
  selectedMessageTypes,
  handleUpdateMessages,
  isSegmented = true
}) => {
  return (
    <MessagesOriginalContainer 
      personas={personas}
      onUpdateMessages={handleUpdateMessages}
      isSegmented={isSegmented}
    />
  );
};

export default MessagesContainer;
