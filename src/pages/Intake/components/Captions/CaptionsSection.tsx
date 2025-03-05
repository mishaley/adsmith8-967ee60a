
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
  const validPersonas = personas.filter(Boolean);
  const validMessageTypes = selectedMessageTypes.filter(Boolean);
  
  const totalPersonas = validPersonas.length;
  const totalMessageTypes = validMessageTypes.length;
  const totalPairs = totalPersonas * totalMessageTypes;
  
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  
  useEffect(() => {
    if (currentPairIndex >= totalPairs && totalPairs > 0) {
      setCurrentPairIndex(0);
    }
  }, [validPersonas, validMessageTypes, totalPairs, currentPairIndex]);
  
  const personaIndex = Math.floor(currentPairIndex / Math.max(1, totalMessageTypes));
  const messageTypeIndex = currentPairIndex % Math.max(1, totalMessageTypes);
  
  const currentPersona = validPersonas[personaIndex] || null;
  const currentMessageType = validMessageTypes[messageTypeIndex] || "";
  
  const personaId = currentPersona?.id ? String(currentPersona.id) : currentPersona ? "persona-0" : "";
  
  const messageContent = personaId && currentMessageType 
    ? generatedMessages[personaId]?.[currentMessageType]?.content || `Generated ${currentMessageType} Example`
    : "No message available";
  
  const goToPrevious = () => {
    setCurrentPairIndex(prev => (prev > 0 ? prev - 1 : totalPairs - 1));
  };
  
  const goToNext = () => {
    setCurrentPairIndex(prev => (prev < totalPairs - 1 ? prev + 1 : 0));
  };
  
  const displayIndex = totalPairs > 0 ? currentPairIndex + 1 : 0;

  const getTableConfig = () => {
    const platform = adPlatform?.toLowerCase() || "";
    
    if (platform === "meta") {
      return {
        columnHeaders: ["PRIMARY TEXT", "HEADLINES", "DESCRIPTIONS"],
        rowCounts: [5, 5, 5]
      };
    } else if (platform === "google") {
      return {
        columnHeaders: ["HEADLINES", "LONG HEADLINES", "DESCRIPTIONS"],
        rowCounts: [15, 5, 5]
      };
    }
    
    return {
      columnHeaders: ["", "", ""],
      rowCounts: [5, 5, 5]
    };
  };

  const { columnHeaders, rowCounts } = getTableConfig();
  
  const renderSingleTable = (columnIndex: number) => {
    const rows = [];
    const header = columnHeaders[columnIndex];
    const rowCount = rowCounts[columnIndex];
    
    if (header) {
      rows.push(
        <tr key="header-row" className="border-b border-gray-200 bg-gray-50">
          <td colSpan={2} className="font-bold text-center py-2">
            {header}
          </td>
        </tr>
      );
    }
    
    for (let i = 0; i < rowCount; i++) {
      rows.push(
        <tr key={`row-${i}`} className="border-b border-gray-200">
          <td className="py-2 px-3">
            <div className="h-[60px] flex items-center">
              <div className="flex-grow"></div>
            </div>
          </td>
          <td className="p-0">
            <div className="h-[60px] w-[60px] border-l border-gray-200"></div>
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
