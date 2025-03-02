
import React from "react";
import { Loader } from "lucide-react";
import { Persona } from "../Personas/types";

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
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Persona</th>
            {selectedMessageTypes.map(type => (
              <th key={type} className="border p-2 text-left">
                {getMessageTypeLabel(type)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {personas.map((persona, index) => (
            <tr key={persona.id || index} className="border-t">
              <td className="border p-2 align-top">
                <div className="flex items-center">
                  {persona.portraitUrl ? (
                    <img 
                      src={persona.portraitUrl} 
                      alt={`Portrait of ${persona.title || `Persona ${index + 1}`}`}
                      className="w-16 h-16 rounded-md object-cover mr-2"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center mr-2">
                      <span className="text-xs text-gray-500">No image</span>
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{persona.title || `Persona ${index + 1}`}</div>
                    <div className="text-sm text-gray-500">
                      {persona.gender}, {persona.ageMin}-{persona.ageMax}
                    </div>
                  </div>
                </div>
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
