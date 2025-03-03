
import React, { useState, useEffect } from "react";
import { Persona } from "../Personas/types";
import { Message } from "../Messages/hooks/useMessagesFetching";
import PersonaDisplay from "./components/PersonaDisplay";
import ResolutionOptions from "./components/ResolutionOptions";
import ImageGenerator from "./components/ImageGenerator";

interface ImagesSectionProps {
  personas: Persona[];
  generatedMessages: Record<string, Record<string, Message>>;
  selectedMessageTypes: string[];
  adPlatform: string;
}

const ImagesSection: React.FC<ImagesSectionProps> = ({ 
  personas, 
  generatedMessages,
  selectedMessageTypes,
  adPlatform
}) => {
  // Calculate total number of persona-message pairs
  const totalPersonas = personas.length;
  const totalMessageTypes = selectedMessageTypes.length;
  const totalPairs = totalPersonas * totalMessageTypes;
  
  // State for tracking the current index
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  
  // Reset the index when personas or message types change
  useEffect(() => {
    setCurrentPairIndex(0);
  }, [personas, selectedMessageTypes]);
  
  // Calculate which persona and message type to show based on the current index
  const personaIndex = Math.floor(currentPairIndex / Math.max(1, totalMessageTypes));
  const messageTypeIndex = currentPairIndex % Math.max(1, totalMessageTypes);
  
  // Get the current persona and message type
  const currentPersona = personas[personaIndex] || null;
  const currentMessageType = selectedMessageTypes[messageTypeIndex] || "";
  
  // Get personaId for the current persona
  const personaId = currentPersona?.id ? String(currentPersona.id) : currentPersona ? "persona-0" : "";
  
  // Get the message content (or fallback text)
  const messageContent = personaId && currentMessageType 
    ? generatedMessages[personaId]?.[currentMessageType]?.content || `Generated ${currentMessageType} Example`
    : "No message available";
  
  // Navigation handlers
  const goToPrevious = () => {
    setCurrentPairIndex(prev => (prev > 0 ? prev - 1 : totalPairs - 1));
  };
  
  const goToNext = () => {
    setCurrentPairIndex(prev => (prev < totalPairs - 1 ? prev + 1 : 0));
  };
  
  // Display index starts from 1 for user-friendly numbering
  const displayIndex = totalPairs > 0 ? currentPairIndex + 1 : 0;
  
  return (
    <>
      <tr className="border-b">
        <td colSpan={2} className="py-4 text-lg">
          <div className="w-full text-left pl-4 flex items-center">
            <span>Images</span>
          </div>
        </td>
      </tr>

      {currentPersona ? (
        <tr>
          <td colSpan={2} className="p-4">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border p-3">
                    <PersonaDisplay 
                      currentPersona={currentPersona}
                      currentMessageType={currentMessageType}
                      messageContent={messageContent}
                      displayIndex={displayIndex}
                      totalPairs={totalPairs}
                      goToPrevious={goToPrevious}
                      goToNext={goToNext}
                    />
                  </td>
                </tr>
                {/* Second row for resolution options */}
                <tr>
                  <td className="border-t-0 border-x border-b p-3 pt-0">
                    <div className="flex justify-center items-center">
                      <ResolutionOptions adPlatform={adPlatform} />
                    </div>
                  </td>
                </tr>
                {/* Third row for generate button and future images */}
                <tr>
                  <td className="border-t-0 border-x border-b p-5">
                    <ImageGenerator 
                      currentPersona={currentPersona} 
                      adPlatform={adPlatform} 
                    />
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
