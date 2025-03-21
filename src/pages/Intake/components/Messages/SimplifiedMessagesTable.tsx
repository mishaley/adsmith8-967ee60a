
import React, { Dispatch, memo, SetStateAction, useMemo } from "react";
import { Persona } from "../Personas/types";
import MessageColumnHeader from "./SimplifiedTable/MessageColumnHeader";
import PersonaCell from "./SimplifiedTable/PersonaCell";
import MessageCell from "./SimplifiedTable/MessageCell";
import AddColumnButton from "./SimplifiedTable/AddColumnButton";
import PersonaPlaceholderCell from "./SimplifiedTable/PersonaPlaceholderCell";

interface SimplifiedMessagesTableProps {
  handleColumnGeneration: (messageType: string) => Promise<void>;
  personas: Persona[];
  selectedMessageTypes: string[];
  generatedMessages: Record<string, Record<string, any>>;
  onMessageTypeChange?: (types: string[]) => void;
  isSegmented?: boolean;
}

const SimplifiedMessagesTable: React.FC<SimplifiedMessagesTableProps> = ({ 
  personas,
  handleColumnGeneration,
  selectedMessageTypes,
  generatedMessages,
  onMessageTypeChange,
  isSegmented = true
}) => {
  // Don't render if no message types are selected
  if (personas.length === 0) {
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
              onGenerateClick={handleColumnGeneration}
                key={column.id}
                columnId={column.id}
                columnType={column.type}
                onTypeChange={(columnId, newType) => {
                  if (onMessageTypeChange) {
                    const newTypes = selectedMessageTypes.map(type => type === columnId ? newType : type);
                    onMessageTypeChange(newTypes);
                  }
                }}
                onRemoveColumn={() => {
                  if (onMessageTypeChange) {
                    const newTypes = selectedMessageTypes.filter(type => type !== column.id);
                    onMessageTypeChange(newTypes);
                  }
                }}
              />
            ))}
            
            {/* Add column button cell - always visible in the header */}
            <AddColumnButton 
              selectedTypes={selectedMessageTypes}
              onTypeChange={onMessageTypeChange}
            />
          </tr>
        </thead>
        <tbody>
          {/* Show general population row when isSegmented is false */}
          {!isSegmented ? (
            <tr>
              <td className="border p-2">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center mr-2 overflow-hidden">
                    {/* Empty state for general population */}
                  </div>
                  <div className="text-sm">
                    Both, age 18-65
                  </div>
                </div>
              </td>
              {columns.map(column => (
                <MessageCell 
                  key={`general-population-${column.id}`}
                  column={column}
                  personaId="general-population"
                />
              ))}
              <td className="border p-1"></td>
            </tr>
          ) : personas.length > 0 ? (
            personas.map((persona, index) => {
              const personaId = persona?.id ? String(persona.id) : `persona-${index}`;
              
              return (
                <tr key={personaId}>
                  <PersonaCell persona={persona} />
                  {columns.map(column => (
                    <MessageCell 
                      key={`${personaId}-${column.id}`}
                      column={column}
                      personaId={personaId}
                    />
                  ))}
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
