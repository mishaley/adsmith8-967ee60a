
import React, { useEffect, useCallback, memo } from "react";
import { Persona } from "../Personas/types";
import SimplifiedMessagesTable from "./SimplifiedMessagesTable";
import { useMessagesState } from "./hooks/useMessagesState";
import { useMessagesFetching } from "./hooks/useMessagesFetching";
import { useMessagesGeneration } from "./hooks/useMessagesGeneration";
import CollapsibleSection from "../CollapsibleSection";

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
  } = useMessagesGeneration(
    safePersonas, 
    selectedMessageTypes, 
    userProvidedMessage, 
    generatedMessages, 
    setGeneratedMessages,
    setIsTableVisible
  );

  const handleColumnGeneration = useCallback(async (messageType: string): Promise<void> => {
    try {
      await handleGenerateColumnMessages(messageType);
    } catch (error) {
      console.error(`Error during generation for ${messageType}:`, error);
      throw error;
    }
  }, [handleGenerateColumnMessages]);

  return (
    <CollapsibleSection title="MESSAGES">
      <div className="bg-transparent">
        <SimplifiedMessagesTable 
          personas={safePersonas}
          selectedMessageTypes={selectedMessageTypes}
          generatedMessages={generatedMessages}
          onMessageTypeChange={(types) => {
            setSelectedMessageTypes(types);
          }}
        />
      </div>
    </CollapsibleSection>
  );
};

export default memo(MessagesSection);
