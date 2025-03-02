
import React, { useState } from "react";
import { Persona } from "../Personas/types";
import MessageTableHeader from "./TableComponents/MessageTableHeader";
import MessageTableRow from "./TableComponents/MessageTableRow";
import { Message } from "./hooks/useMessagesFetching";

// Simplified type definition to avoid deep nesting
type GeneratedMessagesRecord = Record<string, Record<string, Message>>;

interface MessagesTableProps {
  isTableVisible: boolean;
  personas: Persona[];
  selectedMessageTypes: string[];
  generatedMessages: GeneratedMessagesRecord;
  isGeneratingMessages: boolean;
  getMessageTypeLabel: (type: string) => string;
  onGenerateColumnMessages: (messageType: string) => void;
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
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  
  if (!isTableVisible || personas.length === 0 || selectedMessageTypes.length === 0) return null;
  
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
                onGenerateColumnMessages={onGenerateColumnMessages}
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
              cellLoadingStates={loadingStates}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MessagesTable;
