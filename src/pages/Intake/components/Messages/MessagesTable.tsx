
import React, { useState, useEffect } from "react";
import { Persona } from "../Personas/types";
import MessageTableHeader from "./TableComponents/MessageTableHeader";
import MessageTableRow from "./TableComponents/MessageTableRow";
import { Message } from "./hooks/useMessagesFetching";
import { toast } from "sonner";

// Simplified type definition to avoid deep nesting
type GeneratedMessagesRecord = Record<string, Record<string, Message>>;

interface MessagesTableProps {
  isTableVisible: boolean;
  personas: Persona[];
  selectedMessageTypes: string[];
  generatedMessages: GeneratedMessagesRecord;
  isGeneratingMessages: boolean;
  getMessageTypeLabel: (type: string) => string;
  onGenerateColumnMessages: (messageType: string) => Promise<void>;
}

const MessagesTable: React.FC<MessagesTableProps> = ({
  isTableVisible,
  personas,
  selectedMessageTypes,
  generatedMessages,
  isGeneratingMessages,
  getMessageTypeLabel,
  onGenerateColumnMessages
}) => {
  const [cellLoadingStates, setCellLoadingStates] = useState<Record<string, boolean>>({});
  
  // Debug log for generated messages
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && Object.keys(generatedMessages).length > 0) {
      console.log("MessagesTable - generatedMessages:", generatedMessages);
    }
  }, [generatedMessages]);
  
  // Reset cell loading states when generatedMessages changes
  useEffect(() => {
    const newLoadingStates: Record<string, boolean> = {};
    personas.forEach(persona => {
      if (persona.id) {
        selectedMessageTypes.forEach(type => {
          newLoadingStates[`${persona.id}-${type}`] = false;
        });
      }
    });
    setCellLoadingStates(newLoadingStates);
  }, [personas, selectedMessageTypes]);
  
  if (!isTableVisible || personas.length === 0 || selectedMessageTypes.length === 0) return null;
  
  const handleGenerateColumnMessages = async (messageType: string): Promise<void> => {
    console.log(`MessagesTable: Starting generation for ${messageType}`);
    
    // Set all cells in this column to loading state
    const newLoadingStates = { ...cellLoadingStates };
    personas.forEach(persona => {
      if (persona.id) {
        newLoadingStates[`${persona.id}-${messageType}`] = true;
      }
    });
    setCellLoadingStates(newLoadingStates);
    
    try {
      // Call the actual generate function and await it
      await onGenerateColumnMessages(messageType);
      console.log(`MessagesTable: Generation complete for ${messageType}`);
      
      toast({
        title: "Success",
        description: `Generation completed for ${messageType}`
      });
    } catch (error) {
      console.error(`MessagesTable: Error generating ${messageType}:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to generate ${messageType} messages`
      });
    } finally {
      // Reset loading states for this column
      const resetLoadingStates = { ...cellLoadingStates };
      personas.forEach(persona => {
        if (persona.id) {
          resetLoadingStates[`${persona.id}-${messageType}`] = false;
        }
      });
      setCellLoadingStates(resetLoadingStates);
    }
  };
  
  return (
    <div className="mt-6 border rounded overflow-auto">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-64" /> {/* Fixed width for persona column */}
          {selectedMessageTypes.map((type, index) => (
            <col key={`col-${type}-${index}`} /> /* Auto width for message columns */
          ))}
        </colgroup>
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left w-64">Persona</th>
            {selectedMessageTypes.map(type => (
              <MessageTableHeader
                key={type}
                messageType={type}
                getMessageTypeLabel={getMessageTypeLabel}
                onGenerateColumnMessages={handleGenerateColumnMessages}
                isGeneratingMessages={isGeneratingMessages}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {personas.map((persona, index) => (
            <MessageTableRow
              key={persona.id || index}
              persona={persona}
              index={index}
              selectedMessageTypes={selectedMessageTypes}
              generatedMessages={generatedMessages}
              isGeneratingMessages={isGeneratingMessages}
              cellLoadingStates={cellLoadingStates}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MessagesTable;
