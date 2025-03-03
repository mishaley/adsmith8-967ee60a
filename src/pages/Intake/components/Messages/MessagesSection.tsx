
import React, { useEffect } from "react";
import { Persona } from "../Personas/types";
import MessagesList from "./MessagesList";
import MessageTypeSelector from "./MessageTypeSelector";
import UserProvidedInput from "./UserProvidedInput";
import MessagesTable from "./MessagesTable";
import { getMessageTypeLabel } from "./messageUtils";
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
  } = useMessagesState(personas);

  // Update parent component with messages data when they change
  useEffect(() => {
    if (onUpdateMessages) {
      onUpdateMessages(generatedMessages, selectedMessageTypes);
    }
  }, [generatedMessages, selectedMessageTypes, onUpdateMessages]);

  // Show table automatically when message types are selected
  useEffect(() => {
    if (selectedMessageTypes.length > 0 && personas.length > 0) {
      setIsTableVisible(true);
    } else {
      setIsTableVisible(false);
    }
  }, [selectedMessageTypes, personas, setIsTableVisible]);

  const {
    data: messages = [],
    refetch,
    isLoading
  } = useMessagesFetching(selectedPersonaId, selectedMessageTypes);

  const {
    isGeneratingMessages,
    handleGenerateColumnMessages
  } = useMessagesGeneration(
    personas,
    selectedMessageTypes,
    userProvidedMessage,
    generatedMessages,
    setGeneratedMessages,
    setIsTableVisible
  );

  const isUserProvidedSelected = selectedMessageTypes.includes("user-provided");

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
    <>
      <tr>
        <td colSpan={2} className="p-4">
          <div className="flex flex-wrap mb-4 items-start">
            <MessageTypeSelector 
              selectedMessageTypes={selectedMessageTypes}
              toggleMessageType={toggleMessageType}
              isLoaded={isLoaded}
            />
            
            <UserProvidedInput
              userProvidedMessage={userProvidedMessage}
              setUserProvidedMessage={setUserProvidedMessage}
              isUserProvidedSelected={isUserProvidedSelected}
            />
          </div>
          
          <MessagesTable
            isTableVisible={isTableVisible}
            personas={personas}
            selectedMessageTypes={selectedMessageTypes}
            generatedMessages={generatedMessages}
            isGeneratingMessages={isGeneratingMessages || isGeneratingState}
            getMessageTypeLabel={getMessageTypeLabel}
            onGenerateColumnMessages={handleColumnGeneration}
          />
          
          {selectedPersonaId && !isTableVisible && (
            <MessagesList messages={messages} isLoading={isGeneratingMessages || isGeneratingState || isLoading} />
          )}
        </td>
      </tr>
    </>
  );
};

export default MessagesSection;
