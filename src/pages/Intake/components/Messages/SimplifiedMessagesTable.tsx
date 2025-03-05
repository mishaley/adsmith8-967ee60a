
import React, { useState, useEffect } from "react";
import { Persona } from "../Personas/types";
import AddColumnButton from "./SimplifiedTable/AddColumnButton";
import MessageColumnHeader from "./SimplifiedTable/MessageColumnHeader";
import PersonaCell from "./PersonaCell";
import MessageCell from "./SimplifiedTable/MessageCell";
import { useMessageColumns } from "./hooks/useMessageColumns";

interface SimplifiedMessagesTableProps {
  personas: Persona[];
  selectedMessageTypes?: string[];
  onMessageTypeChange?: (messageTypes: string[]) => void;
}

const SimplifiedMessagesTable: React.FC<SimplifiedMessagesTableProps> = ({
  personas,
  selectedMessageTypes = [],
  onMessageTypeChange
}) => {
  const {
    messageColumns,
    handleAddColumn,
    handleMessageTypeChange,
    handleContentChange
  } = useMessageColumns();

  // Extract all selected message types from columns
  useEffect(() => {
    const types = messageColumns
      .map(col => col.type)
      .filter(type => type && type !== "user-provided" && type !== "remove");
    
    if (onMessageTypeChange) {
      console.log("SimplifiedMessagesTable: Message types updated:", types);
      onMessageTypeChange(types);
    }
  }, [messageColumns, onMessageTypeChange]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            {/* Persona header cell */}
            <th className="border p-2 text-left w-48">
              Persona
            </th>
            
            {/* Message type header cells */}
            {messageColumns.map(column => (
              <MessageColumnHeader
                key={column.id}
                columnId={column.id}
                columnType={column.type}
                onTypeChange={handleMessageTypeChange}
              />
            ))}
            
            {/* Add column button */}
            <th className="border p-1 w-12">
              <AddColumnButton onAddColumn={handleAddColumn} />
            </th>
          </tr>
        </thead>
        <tbody>
          {personas.map((persona, personaIndex) => {
            // Skip null personas
            if (!persona) return null;
            
            // Get persona ID for referencing message content
            const personaId = persona.id ? String(persona.id) : `persona-${personaIndex}`;
            
            return (
              <tr key={personaId} className="align-top">
                {/* Persona cell */}
                <PersonaCell 
                  persona={persona} 
                  index={personaIndex}
                />
                
                {/* Message cells */}
                {messageColumns.map(column => (
                  <MessageCell
                    key={`${personaId}-${column.id}`}
                    column={column}
                    personaId={personaId}
                    onContentChange={handleContentChange}
                  />
                ))}
                
                {/* Empty cell for add column button alignment */}
                <td className="border p-1"></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SimplifiedMessagesTable;
