
import React from "react";
import { useMessageColumns } from "./hooks/useMessageColumns";
import MessageColumnHeader from "./SimplifiedTable/MessageColumnHeader";
import MessageCell from "./SimplifiedTable/MessageCell";
import PersonaPlaceholderCell from "./SimplifiedTable/PersonaPlaceholderCell";
import AddColumnButton from "./SimplifiedTable/AddColumnButton";

const SimplifiedMessagesTable: React.FC = () => {
  const {
    messageColumns,
    handleAddColumn,
    handleMessageTypeChange,
    handleContentChange
  } = useMessageColumns();

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
          <tr className="border-b">
            <td className="border p-2">
              <PersonaPlaceholderCell />
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
        </tbody>
      </table>
    </div>
  );
};

export default SimplifiedMessagesTable;
