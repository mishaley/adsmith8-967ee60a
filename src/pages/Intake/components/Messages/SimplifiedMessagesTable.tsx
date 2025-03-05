
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

  const hasPersonas = personas && personas.length > 0;

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
            // Map through all available personas
            personas.map((persona, index) => (
              <tr key={index} className="border-b">
                <td className="border p-2">
                  <PersonaCell persona={persona} />
                </td>
                
                {/* Render message cells for each column */}
                {messageColumns.map(column => (
                  <td key={column.id} className="border p-2 align-top">
                    <MessageCell 
                      column={column}
                      onContentChange={handleContentChange}
                    />
                  </td>
                ))}
                
                {/* Empty cell for "+" button column */}
                <td className="border p-2"></td>
              </tr>
            ))
          ) : (
            // Show placeholder when no personas are available
            <tr className="border-b">
              <td className="border p-2">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center mr-2">
                    {/* Empty gray placeholder box */}
                  </div>
                  <div>
                    <div className="text-sm text-gray-300">
                      Gender, Age Range
                    </div>
                    <div className="text-sm text-gray-300">
                      Interests
                    </div>
                  </div>
                </div>
              </td>
              
              {/* Render message cells for each column */}
              {messageColumns.map(column => (
                <td key={column.id} className="border p-2 align-top">
                  <MessageCell 
                    column={column}
                    onContentChange={handleContentChange}
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
