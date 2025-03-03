
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
  // Use index as fallback for personas without IDs
  const personaId = persona.id ? String(persona.id) : `persona-${index}`;
  
  return (
    <tr className="border-b">
      <td className="border p-2">
        <PersonaCell persona={persona} index={index} />
      </td>
      {selectedMessageTypes.map((messageType) => {
        const isLoading = cellLoadingStates[`${personaId}-${messageType}`] || false;
        
        return (
          <MessageTableCell
            key={`${personaId}-${messageType}`}
            personaId={personaId}
            messageType={messageType}
            isLoading={isGeneratingMessages || isLoading}
            generatedMessages={generatedMessages}
          />
        );
      })}
    </tr>
  );
};

export default MessageTableRow;
