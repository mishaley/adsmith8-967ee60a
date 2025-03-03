
import React from "react";
import { Persona } from "../Personas/types";
import MessagesList from "./MessagesList";
import MessageTypeSelector from "./MessageTypeSelector";
import UserProvidedInput from "./UserProvidedInput";
import GenerateButton from "./GenerateButton";
import MessagesTable from "./MessagesTable";
import { getMessageTypeLabel } from "./messageUtils";
import { useMessagesState } from "./hooks/useMessagesState";
import { useMessagesFetching } from "./hooks/useMessagesFetching";
import { useMessagesGeneration } from "./hooks/useMessagesGeneration";

interface MessagesSectionProps {
  personas: Persona[];
}

const MessagesSection: React.FC<MessagesSectionProps> = ({ personas }) => {
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
    setIsTableVisible
  } = useMessagesState(personas);

  const {
    data: messages = [],
    refetch,
    isLoading
  } = useMessagesFetching(selectedPersonaId, selectedMessageTypes);

  const {
    isGeneratingMessages,
    generateMessages,
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

  // Create a wrapper function to adapt the return type to what MessagesTable expects
  const handleColumnGeneration = async (messageType: string): Promise<void> => {
    console.log(`Starting generation for ${messageType}`);
    try {
      await handleGenerateColumnMessages(messageType);
      console.log(`Generation completed for ${messageType}`);
    } catch (error) {
      console.error(`Error during generation for ${messageType}:`, error);
      throw error; // Re-throw to maintain error propagation
    }
  };

  return (
    <>
      <tr className="border-b">
        <td colSpan={2} className="py-4 text-lg">
          <div className="w-full text-left pl-4 flex items-center">
            <span>Messages</span>
          </div>
        </td>
      </tr>
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
          
          <div className="mb-4">
            <GenerateButton
              isGeneratingMessages={isGeneratingMessages || isGeneratingState}
              selectedMessageTypes={selectedMessageTypes}
              isLoaded={isLoaded}
              generateMessages={generateMessages}
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
