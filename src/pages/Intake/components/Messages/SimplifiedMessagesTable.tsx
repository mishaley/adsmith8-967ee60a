
import React from "react";
import { useMessageColumns } from "./hooks/useMessageColumns";
import MessageColumnHeader from "./SimplifiedTable/MessageColumnHeader";
import MessageCell from "./SimplifiedTable/MessageCell";
import PersonaCell from "./SimplifiedTable/PersonaCell";
import AddColumnButton from "./SimplifiedTable/AddColumnButton";
import { Persona } from "../Personas/types";

interface SimplifiedMessagesTableProps {
  personas?: Persona[];
}

const SimplifiedMessagesTable: React.FC<SimplifiedMessagesTableProps> = ({ personas = [] }) => {
  const {
    messageColumns,
    handleAddColumn,
    handleMessageTypeChange,
    handleContentChange
  } = useMessageColumns();

  // Filter out any null personas and create a clean array
  const validPersonas = personas.filter(persona => persona !== null && persona !== undefined);
  const hasPersonas = validPersonas.length > 0;
  
  return (
    <div className="mt-6 border rounded overflow-auto">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-64" /> {/* Fixed width for persona column */}
          {messageColumns.map(column => (
            <col key={`col-${column.id}`} /> /* Auto width for message columns */
          ))}
          <col className="w-16" /> {/* Fixed width for add column button */}
        </colgroup>
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left w-64">Persona</th>
            
            {/* Render each message type column */}
            {messageColumns.map(column => (
              <MessageColumnHeader
                key={column.id}
                columnId={column.id}
                columnType={column.type}
                onTypeChange={handleMessageTypeChange}
              />
            ))}
            
            {/* Add column button */}
            <th className="border p-2 text-center w-16">
              <AddColumnButton onAddColumn={handleAddColumn} />
            </th>
          </tr>
        </thead>
        <tbody>
          {hasPersonas ? (
            // Only map through valid personas
            validPersonas.map((persona, index) => (
              <tr key={`persona-row-${index}`} className="border-b">
                <td className="border p-2">
                  <PersonaCell persona={persona} />
                </td>
                
                {/* Render message cells for each column */}
                {messageColumns.map(column => (
                  <td key={`cell-${column.id}-${index}`} className="border p-2 align-top">
                    <MessageCell 
                      column={column}
                      onContentChange={handleContentChange}
                      personaId={persona?.id?.toString() || `persona-${index}`}
                    />
                  </td>
                ))}
                
                {/* Empty cell for "+" button column */}
                <td className="border p-2"></td>
              </tr>
            ))
          ) : (
            // Show a single placeholder row when no personas are available
            <tr className="border-b">
              <td className="border p-2">
                <PersonaCell persona={null} />
              </td>
              
              {/* Render message cells for each column */}
              {messageColumns.map(column => (
                <td key={`default-cell-${column.id}`} className="border p-2 align-top">
                  <MessageCell 
                    column={column}
                    onContentChange={handleContentChange}
                    personaId="default"
                  />
                </td>
              ))}
              
              {/* Empty cell for "+" button column */}
              <td className="border p-2"></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SimplifiedMessagesTable;
