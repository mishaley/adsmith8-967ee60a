
import React, { useEffect } from "react";
import { Persona } from "../Personas/types";
import SimplifiedMessagesTable from "./SimplifiedMessagesTable";
import { useMessagesState } from "./hooks/useMessagesState";
import { useMessagesFetching } from "./hooks/useMessagesFetching";
import { useMessagesGeneration } from "./hooks/useMessagesGeneration";

interface MessagesSectionProps {
  personas: Persona[];
  onUpdateMessages?: (generatedMessages: Record<string, Record<string, any>>, selectedTypes: string[]) => void;
}

const MessagesSection: React.FC<MessagesSectionProps> = ({
  personas,
  onUpdateMessages
}) => {
  // Make sure we handle null personas properly
  const safePersonas = personas.filter(Boolean);
  
  const {
    selectedMessageTypes,
    isGeneratingMessages: isGeneratingState,
    isLoaded,
    userProvidedMessage,
    generatedMessages,
    isTableVisible,
    selectedPersonaId,
    toggleMessageType,
    setUserProvidedMessage,
    setGeneratedMessages,
    setIsTableVisible,
    setSelectedMessageTypes
  } = useMessagesState(safePersonas);

  useEffect(() => {
    if (onUpdateMessages) {
      onUpdateMessages(generatedMessages, selectedMessageTypes);
    }
  }, [generatedMessages, selectedMessageTypes, onUpdateMessages]);

  const {
    data: messages = [],
    refetch,
    isLoading
  } = useMessagesFetching(selectedPersonaId, selectedMessageTypes);

  const {
    isGeneratingMessages,
    handleGenerateColumnMessages
  } = useMessagesGeneration(safePersonas, selectedMessageTypes, userProvidedMessage, generatedMessages, setGeneratedMessages, setIsTableVisible);

  const handleColumnGeneration = async (messageType: string): Promise<void> => {
    console.log(`Starting generation for ${messageType}`);
    try {
      await handleGenerateColumnMessages(messageType);
      console.log(`Generation completed for ${messageType}`);
    } catch (error) {
      console.error(`Error during generation for ${messageType}:`, error);
      throw error;
    }
  };

  return <>
      <div className="mt-8 mb-4">
        <h3 className="text-center text-gray-700 mb-3 font-bold">Messages</h3>
        <SimplifiedMessagesTable personas={safePersonas} />
      </div>
    </>;
};

export default MessagesSection;
