
import React, { useState, useEffect, useMemo } from "react";
import { Persona } from "../Personas/types";
import AddColumnButton from "./SimplifiedTable/AddColumnButton";
import MessageColumnHeader from "./SimplifiedTable/MessageColumnHeader";
import PersonaCell from "./PersonaCell";
import MessageCell from "./SimplifiedTable/MessageCell";
import { useMessageColumns } from "./hooks/useMessageColumns";
import { useMessagesGeneration } from "./hooks/useMessagesGeneration";
import { toast } from "sonner";
import { GeneratedMessagesRecord } from "./hooks/useMessagesState";

interface SimplifiedMessagesTableProps {
  personas: Persona[];
  selectedMessageTypes?: string[];
  onMessageTypeChange?: (messageTypes: string[]) => void;
  generatedMessages?: GeneratedMessagesRecord;
}

const SimplifiedMessagesTable: React.FC<SimplifiedMessagesTableProps> = ({
  personas,
  selectedMessageTypes = [],
  onMessageTypeChange,
  generatedMessages = {}
}) => {
  const {
    messageColumns,
    handleAddColumn,
    handleMessageTypeChange,
    handleContentChange
  } = useMessageColumns();

  // Setup message generation functionality
  const { handleGenerateColumnMessages } = useMessagesGeneration(
    personas,
    selectedMessageTypes, 
    "", 
    generatedMessages || {}, // Ensure we have a default empty object
    () => {}, 
    () => {}
  );

  // Handle generate button click
  const handleGenerateClick = async (columnId: string, columnType: string) => {
    if (!columnType) {
      toast.error("Please select a message type first");
      return;
    }
    
    try {
      await handleGenerateColumnMessages(columnType);
    } catch (error) {
      console.error("Error generating messages:", error);
      toast.error("Failed to generate messages");
    }
  };

  // Extract all selected message types from columns - wrapped in useMemo to prevent unnecessary recalculations
  useEffect(() => {
    const types = messageColumns
      .map(col => col.type)
      .filter(type => type && type !== "user-provided" && type !== "remove");
    
    if (onMessageTypeChange) {
      onMessageTypeChange(types);
    }
  }, [messageColumns, onMessageTypeChange]);

  // Memoize the table cells to prevent unnecessary re-renders
  const renderMessageCells = useMemo(() => {
    return personas.map((persona, personaIndex) => {
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
          {messageColumns.map(column => {
            const columnType = column.type;
            
            // Create content object with the message data for this cell
            const content = columnType && generatedMessages?.[personaId]?.[columnType] 
              ? { [personaId]: generatedMessages[personaId][columnType] }
              : undefined;
            
            return (
              <MessageCell
                key={`${personaId}-${column.id}`}
                column={{
                  ...column,
                  content
                }}
                personaId={personaId}
                onContentChange={handleContentChange}
              />
            );
          })}
          
          {/* Empty cell for add column button alignment */}
          <td className="border p-1"></td>
        </tr>
      );
    });
  }, [personas, messageColumns, generatedMessages, handleContentChange]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
        <colgroup>
          {/* This column for personas adapts to content width */}
          <col style={{ width: "auto" }} />
          
          {/* All message columns get equal remaining width */}
          {messageColumns.map((col) => (
            <col key={`col-${col.id}`} style={{ width: `${70 / Math.max(messageColumns.length, 1)}%` }} />
          ))}
          
          {/* Fixed width for add button column */}
          <col style={{ width: "50px" }} />
        </colgroup>
        
        <thead>
          <tr className="bg-gray-50">
            {/* Persona header cell */}
            <th className="border p-2 text-left">
              Persona
            </th>
            
            {/* Message type header cells */}
            {messageColumns.map(column => (
              <MessageColumnHeader
                key={column.id}
                columnId={column.id}
                columnType={column.type}
                isNewColumn={column.isNew}
                onTypeChange={handleMessageTypeChange}
                onGenerateClick={handleGenerateClick}
              />
            ))}
            
            {/* Add column button */}
            <th className="border p-1 w-12">
              <AddColumnButton onAddColumn={handleAddColumn} />
            </th>
          </tr>
        </thead>
        <tbody>
          {renderMessageCells}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(SimplifiedMessagesTable);
