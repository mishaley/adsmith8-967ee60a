
import React from "react";
import { Persona } from "../../Personas/types";
import PersonaCell from "../PersonaCell";
import MessageTableCell from "./MessageTableCell";
import { Message } from "../hooks/useMessagesFetching";

interface MessageTableRowProps {
  persona: Persona;
  index: number;
  selectedMessageTypes: string[];
  generatedMessages: Record<string, Record<string, Message>>;
  isGeneratingMessages: boolean;
  cellLoadingStates: Record<string, boolean>;
}

const MessageTableRow: React.FC<MessageTableRowProps> = ({
  persona,
  index,
  selectedMessageTypes,
  generatedMessages,
  isGeneratingMessages,
  cellLoadingStates
}) => {
  // Ensure persona ID is a string
  const personaId = persona.id ? String(persona.id) : "";
  
  // Enhanced logging for debugging
  console.log(`MessageTableRow ${index}:`, {
    personaId,
    personaIdType: typeof personaId,
    personaName: persona.name,
    hasValidId: !!personaId,
    messageTypes: selectedMessageTypes,
    hasMessagesForThisPersona: !!generatedMessages[personaId],
    availableMessageTypesForPersona: generatedMessages[personaId] 
      ? Object.keys(generatedMessages[personaId]) 
      : []
  });
  
  // Skip rendering if no persona ID
  if (!personaId) {
    console.warn(`Persona at index ${index} has no ID, cannot render row`, persona);
    return null;
  }

  // Check if a specific cell is loading
  const isCellLoading = (personaId: string, messageType: string) => {
    const cellKey = `${personaId}-${messageType}`;
    return cellLoadingStates[cellKey] === true;
  };

  return (
    <tr className="border-t">
      <td className="border p-2 align-top w-64">
        <PersonaCell persona={persona} index={index} />
      </td>
      {selectedMessageTypes.map(type => (
        <MessageTableCell
          key={`${personaId}-${type}`}
          personaId={personaId}
          messageType={type}
          isLoading={isGeneratingMessages || isCellLoading(personaId, type)}
          generatedMessages={generatedMessages}
        />
      ))}
    </tr>
  );
};

export default MessageTableRow;
