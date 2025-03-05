import React, { useState, useEffect } from "react";
import { Persona } from "../Personas/types";
import { Message } from "../Messages/hooks/useMessagesFetching";
import PersonaDisplay from "../Images/components/PersonaDisplay";
import CollapsibleSection from "../CollapsibleSection";

interface CaptionsSectionProps {
  personas: Persona[];
  generatedMessages: Record<string, Record<string, Message>>;
  selectedMessageTypes: string[];
  adPlatform: string;
}

const CaptionsSection: React.FC<CaptionsSectionProps> = ({ 
  personas, 
  generatedMessages,
  selectedMessageTypes,
  adPlatform
}) => {
  // Filter out any null or undefined personas and messages
  const validPersonas = personas.filter(Boolean);
  const validMessageTypes = selectedMessageTypes.filter(Boolean);
  
  // Calculate total number of persona-message pairs
  const totalPersonas = validPersonas.length;
  const totalMessageTypes = validMessageTypes.length;
  const totalPairs = totalPersonas * totalMessageTypes;
  
  // State for tracking the current index
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  
  // Reset the index when personas or message types change
  useEffect(() => {
    if (currentPairIndex >= totalPairs && totalPairs > 0) {
      setCurrentPairIndex(0);
    }
  }, [validPersonas, validMessageTypes, totalPairs, currentPairIndex]);
  
  // Calculate which persona and message type to show based on the current index
  const personaIndex = Math.floor(currentPairIndex / Math.max(1, totalMessageTypes));
  const messageTypeIndex = currentPairIndex % Math.max(1, totalMessageTypes);
  
  // Get the current persona and message type
  const currentPersona = validPersonas[personaIndex] || null;
  const currentMessageType = validMessageTypes[messageTypeIndex] || "";
  
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

  // Generate 11 rows for the table
  const renderTableRows = () => {
    const rows = [];
    
    // Add header row based on ad platform
    if (adPlatform && adPlatform.toLowerCase() === "meta") {
      rows.push(
        <tr key="header-row" className="border-b border-gray-200 bg-gray-50">
          <td className="border-r border-gray-200 w-1/3 font-bold text-center py-2">
            PRIMARY TEXT
          </td>
          <td className="border-r border-gray-200 w-1/3 font-bold text-center py-2">
            HEADLINE
          </td>
          <td className="w-1/3 font-bold text-center py-2">
            DESCRIPTION
          </td>
        </tr>
      );
    }
    
    // Calculate how many regular rows to add (if we have a header, add 10 more rows, otherwise 11)
    const regularRowCount = (adPlatform && adPlatform.toLowerCase() === "meta") ? 10 : 11;
    
    for (let i = 0; i < regularRowCount; i++) {
      rows.push(
        <tr key={`row-${i}`} className="border-b border-gray-200">
          <td className="border-r border-gray-200 w-1/3">
            <div className="h-[60px]"></div>
          </td>
          <td className="border-r border-gray-200 w-1/3">
            <div className="h-[60px]"></div>
          </td>
          <td className="w-1/3">
            <div className="h-[60px]"></div>
          </td>
        </tr>
      );
    }
    return rows;
  };
  
  return (
    <CollapsibleSection title="CAPTIONS">
      {totalPairs > 0 ? (
        <div className="border rounded-md overflow-hidden bg-white">
          <div className="p-4 border-b">
            <PersonaDisplay 
              currentPersona={currentPersona}
              currentMessageType={currentMessageType}
              messageContent={messageContent}
              displayIndex={displayIndex}
              totalPairs={totalPairs}
              goToPrevious={goToPrevious}
              goToNext={goToNext}
            />
          </div>
          <div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <tbody>
                  {renderTableRows()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500 bg-white rounded-md">
          No personas available to display
        </div>
      )}
    </CollapsibleSection>
  );
};

export default CaptionsSection;
