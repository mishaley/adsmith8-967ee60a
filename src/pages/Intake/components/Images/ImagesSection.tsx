
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
  
  // Only use the first persona as per the personaCount setting
  const firstPersona = personas.length > 0 ? personas[0] : null;
  
  // Get personaId for the first persona
  const personaId = firstPersona?.id ? String(firstPersona.id) : firstPersona ? "persona-0" : "";
  
  // Get the message content (or fallback text)
  const messageContent = personaId && firstMessageType 
    ? generatedMessages[personaId]?.[firstMessageType]?.content || `Generated ${firstMessageType} Example`
    : "No message available";
  
  // Calculate total number of persona-message pairs
  const totalPersonas = personas.length;
  const totalMessageTypes = selectedMessageTypes.length;
  const totalPairs = totalPersonas * totalMessageTypes;
  
  // Calculate current index - for now we're only showing the first
  const currentIndex = (totalPairs > 0) ? 1 : 0;
  
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
                      {/* Index counter box */}
                      <div className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 mr-3 flex items-center justify-center min-w-[60px]">
                        <span className="font-medium">{currentIndex} / {totalPairs}</span>
                      </div>
                      
                      {/* Portrait - maintaining aspect ratio and doubling height from h-8 to h-16 */}
                      {firstPersona.portraitUrl ? (
                        <img 
                          src={firstPersona.portraitUrl} 
                          alt="Persona portrait"
                          className="w-auto h-16 rounded-md object-cover mr-4"
                        />
                      ) : (
                        <div className="w-auto h-16 bg-gray-200 rounded-md flex items-center justify-center mr-4">
                          <span className="text-gray-500 text-xs">No image</span>
                        </div>
                      )}
                      
                      {/* Combined text with bullet point separators and 50% larger text */}
                      <div className="flex-1">
                        <span className="text-lg text-gray-700">
                          {firstPersona.gender}, {firstPersona.ageMin}-{firstPersona.ageMax} • {firstPersona.interests?.join(", ") || "No interests"} • {messageContent}
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
