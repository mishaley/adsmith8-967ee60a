
import React from "react";
import { Loader } from "lucide-react";
import { Persona } from "../Personas/types";
import PersonaCell from "./PersonaCell";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  type: string;
  content: string;
}

interface MessagesTableProps {
  isTableVisible: boolean;
  personas: Persona[];
  selectedMessageTypes: string[];
  generatedMessages: Record<string, Record<string, Message>>;
  isGeneratingMessages: boolean;
  getMessageTypeLabel: (type: string) => string;
}

const MessagesTable: React.FC<MessagesTableProps> = ({
  isTableVisible,
  personas,
  selectedMessageTypes,
  generatedMessages,
  isGeneratingMessages,
  getMessageTypeLabel
}) => {
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
              <th key={type} className="border p-2 text-left">
                <div className="flex items-center gap-2">
                  <span>{getMessageTypeLabel(type)}</span>
                  <Button variant="outline" size="sm" className="py-0 px-2 h-6 text-xs">
                    Generate
                  </Button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {personas.map((persona, index) => (
            <tr key={persona.id || index} className="border-t">
              <td className="border p-2 align-top w-64">
                <PersonaCell persona={persona} index={index} />
              </td>
              {selectedMessageTypes.map(type => (
                <td key={`${persona.id}-${type}`} className="border p-2 align-top">
                  {isGeneratingMessages ? (
                    <div className="flex items-center justify-center h-16">
                      <Loader className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    <div>
                      {persona.id && generatedMessages[persona.id]?.[type] ? (
                        <p>{generatedMessages[persona.id][type].content}</p>
                      ) : (
                        <p className="text-gray-400">No message generated</p>
                      )}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MessagesTable;
