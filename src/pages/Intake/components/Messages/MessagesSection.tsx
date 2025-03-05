
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

  // Call onUpdateMessages whenever generatedMessages or selectedMessageTypes change
  useEffect(() => {
    if (onUpdateMessages) {
      console.log("MessagesSection: Updating parent with messages", {
        messageTypes: selectedMessageTypes,
        personaCount: safePersonas.length,
        messageCount: Object.keys(generatedMessages).length,
        totalPairs: safePersonas.length * selectedMessageTypes.length
      });
      onUpdateMessages(generatedMessages, selectedMessageTypes);
    }
  }, [generatedMessages, selectedMessageTypes, onUpdateMessages, safePersonas.length]);

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

  return (
    <div className="bg-[#e9f2fe] p-4 mb-6 rounded-lg">
      <h2 className="text-center text-gray-700 mb-4 font-bold text-xl">MESSAGES</h2>
      <div className="bg-white p-4 rounded-md">
        <SimplifiedMessagesTable 
          personas={safePersonas}
          selectedMessageTypes={selectedMessageTypes}
          onMessageTypeChange={(types) => {
            setSelectedMessageTypes(types);
          }}
        />
      </div>
    </div>
  );
};

export default MessagesSection;
