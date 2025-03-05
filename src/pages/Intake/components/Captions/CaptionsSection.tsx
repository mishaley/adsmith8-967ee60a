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

  // Get column headers based on platform
  const getColumnHeaders = () => {
    if (adPlatform && adPlatform.toLowerCase() === "meta") {
      return ["PRIMARY TEXT", "HEADLINES", "DESCRIPTIONS"];
    }
    return ["", "", ""];
  };

  const columnHeaders = getColumnHeaders();
  const rowCount = adPlatform && adPlatform.toLowerCase() === "meta" ? 5 : 11;

  // Render a single table for one column
  const renderSingleTable = (columnIndex: number) => {
    const rows = [];
    const header = columnHeaders[columnIndex];
    
    // Add header row if we have a header
    if (adPlatform && adPlatform.toLowerCase() === "meta") {
      rows.push(
        <tr key="header-row" className="border-b border-gray-200 bg-gray-50">
          <td className="w-full font-bold text-center py-2">
            {header}
          </td>
        </tr>
      );
    }
    
    // Add empty data rows
    for (let i = 0; i < rowCount; i++) {
      rows.push(
        <tr key={`row-${i}`} className="border-b border-gray-200">
          <td className="w-full">
            <div className="h-[60px]"></div>
          </td>
        </tr>
      );
    }
    
    return (
      <div className="bg-white rounded-md overflow-hidden border border-gray-200">
        <table className="w-full border-collapse">
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <CollapsibleSection title="CAPTIONS">
      {totalPairs > 0 ? (
        <div className="rounded-md overflow-hidden bg-white">
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
          <div className="p-4">
            <div className="flex space-x-3">
              <div className="w-1/3">
                {renderSingleTable(0)}
              </div>
              <div className="w-1/3">
                {renderSingleTable(1)}
              </div>
              <div className="w-1/3">
                {renderSingleTable(2)}
              </div>
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
