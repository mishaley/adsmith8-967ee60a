
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
  // Check if persona has an ID
  if (!persona.id) {
    console.warn(`Persona at index ${index} has no ID, cannot render row`, persona);
    return null;
  }

  // Log data for this row
  console.log(`Rendering MessageTableRow for persona ID ${persona.id}:`, {
    messageTypes: selectedMessageTypes,
    hasMessages: !!generatedMessages[persona.id],
    messageKeys: generatedMessages[persona.id] ? Object.keys(generatedMessages[persona.id]) : []
  });
  
  // Check if a specific cell is loading
  const isCellLoading = (personaId: string, messageType: string) => {
    return cellLoadingStates[`${personaId}-${messageType}`] === true;
  };

  return (
    <tr className="border-t">
      <td className="border p-2 align-top w-64">
        <PersonaCell persona={persona} index={index} />
      </td>
      {selectedMessageTypes.map(type => (
        <MessageTableCell
          key={`${persona.id}-${type}`}
          personaId={persona.id}
          messageType={type}
          isLoading={isGeneratingMessages || isCellLoading(persona.id, type)}
          generatedMessages={generatedMessages}
        />
      ))}
    </tr>
  );
};

export default MessageTableRow;
