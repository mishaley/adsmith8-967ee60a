
import React, { memo, useMemo } from "react";
import { Persona } from "../Personas/types";
import MessageColumnHeader from "./SimplifiedTable/MessageColumnHeader";
import PersonaCell from "./SimplifiedTable/PersonaCell";
import MessageCell from "./SimplifiedTable/MessageCell";
import AddColumnButton from "./SimplifiedTable/AddColumnButton";
import PersonaPlaceholderCell from "./SimplifiedTable/PersonaPlaceholderCell";

interface SimplifiedMessagesTableProps {
  personas: Persona[];
  selectedMessageTypes: string[];
  generatedMessages: Record<string, Record<string, any>>;
  onMessageTypeChange?: (types: string[]) => void;
}

const SimplifiedMessagesTable: React.FC<SimplifiedMessagesTableProps> = ({ 
  personas, 
  selectedMessageTypes,
  generatedMessages,
  onMessageTypeChange
}) => {
  // Don't render if no message types are selected
  if (!selectedMessageTypes || selectedMessageTypes.length === 0) {
    return null;
  }
  
  // Format column data for the table
  const columns = useMemo(() => {
    return selectedMessageTypes.map(type => ({
      id: type,
      type,
      content: generatedMessages
    }));
  }, [selectedMessageTypes, generatedMessages]);
  
  // Calculate table class based on number of columns
  const tableClass = useMemo(() => {
    return `w-full border-collapse ${columns.length <= 2 ? 'table-fixed' : ''}`;
  }, [columns.length]);
  
  return (
    <div className="overflow-x-auto">
      <table className={tableClass}>
        <thead>
          <tr>
            {/* Persona header cell */}
            <th className="border p-2 w-1/4 bg-gray-100">Persona</th>
            
            {/* Message type header cells */}
            {columns.map(column => (
              <MessageColumnHeader 
                key={column.id}
                columnId={column.id}
                columnType={column.type}
                onTypeChange={(columnId, newType) => {
                  // This is not currently supported but could be implemented
                }}
                onRemoveColumn={() => {
                  if (onMessageTypeChange) {
                    const newTypes = selectedMessageTypes.filter(type => type !== column.id);
                    onMessageTypeChange(newTypes);
                  }
                }}
              />
            ))}
            
            {/* Add column button cell */}
            <AddColumnButton 
              selectedTypes={selectedMessageTypes}
              onTypeChange={onMessageTypeChange}
            />
          </tr>
        </thead>
        <tbody>
          {personas.length > 0 ? (
            personas.map((persona, index) => {
              // Generate a unique ID for this persona
              const personaId = persona?.id ? String(persona.id) : `persona-${index}`;
              
              return (
                <tr key={personaId}>
                  {/* Persona cell */}
                  <PersonaCell persona={persona} />
                  
                  {/* Message cells for each column */}
                  {columns.map(column => (
                    <MessageCell 
                      key={`${personaId}-${column.id}`}
                      column={column}
                      personaId={personaId}
                    />
                  ))}
                  
                  {/* Empty cell to match the add column button */}
                  <td className="border p-1"></td>
                </tr>
              );
            })
          ) : (
            <tr>
              <PersonaPlaceholderCell />
              {columns.map(column => (
                <td key={column.id} className="border p-2 text-center text-gray-500">
                  No personas generated yet
                </td>
              ))}
              <td className="border p-1"></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default memo(SimplifiedMessagesTable);
