
import React from "react";
import { Persona } from "../Personas/types";
import { Message } from "../Messages/hooks/useMessagesFetching";

interface ImagesSectionProps {
  personas: Persona[];
  generatedMessages: Record<string, Record<string, Message>>;
  selectedMessageTypes: string[];
}

const ImagesSection: React.FC<ImagesSectionProps> = ({ 
  personas, 
  generatedMessages,
  selectedMessageTypes 
}) => {
  // Get the first message type if available, otherwise use empty string
  const firstMessageType = selectedMessageTypes.length > 0 ? selectedMessageTypes[0] : "";
  const firstPersona = personas.length > 0 ? personas[0] : null;
  
  // Get personaId for the first persona
  const personaId = firstPersona?.id ? String(firstPersona.id) : firstPersona ? "persona-0" : "";
  
  // Get the message content (or fallback text)
  const messageContent = personaId && firstMessageType 
    ? generatedMessages[personaId]?.[firstMessageType]?.content || `Generated ${firstMessageType} Example`
    : "No message available";
  
  return (
    <>
      <tr className="border-b">
        <td colSpan={2} className="py-4 text-lg">
          <div className="w-full text-left pl-4 flex items-center">
            <span>Images</span>
          </div>
        </td>
      </tr>
      {firstPersona ? (
        <tr>
          <td colSpan={2} className="p-4">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border p-3">
                    <div className="flex items-center">
                      {/* Portrait - Reduced size from w-24 h-24 to w-16 h-16 */}
                      {firstPersona.portraitUrl ? (
                        <img 
                          src={firstPersona.portraitUrl} 
                          alt="Persona portrait"
                          className="w-16 h-16 rounded-md object-cover mr-4"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center mr-4">
                          <span className="text-gray-500 text-xs">No image</span>
                        </div>
                      )}
                      
                      {/* Demographics */}
                      <div className="mr-4">
                        <span className="text-sm text-gray-700">
                          {firstPersona.gender}, {firstPersona.ageMin}-{firstPersona.ageMax}
                        </span>
                      </div>
                      
                      {/* Interests */}
                      <div className="mr-4">
                        <span className="text-sm text-gray-700">
                          {firstPersona.interests?.join(", ") || "No interests"}
                        </span>
                      </div>
                      
                      {/* Message - Updated styling to match other elements */}
                      <div className="flex-1">
                        <span className="text-sm text-gray-700 block p-2 bg-gray-50 rounded border border-gray-100">
                          {messageContent}
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      ) : (
        <tr>
          <td colSpan={2} className="p-4 text-center text-gray-500">
            No personas available to display
          </td>
        </tr>
      )}
    </>
  );
};

export default ImagesSection;
