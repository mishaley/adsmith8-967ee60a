
import React, { useState, useEffect, useMemo } from "react";
import { Persona } from "../Personas/types";
import { Message } from "../Messages/hooks/useMessagesFetching";
import PersonaDisplay from "./components/PersonaDisplay";
import ResolutionOptions from "./components/ResolutionOptions";
import ImageGenerator from "./components/ImageGenerator";
import CollapsibleSection from "../CollapsibleSection";
import FormatSelector from "./components/FormatSelector";

interface ImagesSectionProps {
  personas: Persona[];
  generatedMessages: Record<string, Record<string, Message>>;
  selectedMessageTypes: string[];
  adPlatform: string;
  offering?: string;
}

const ImagesSection: React.FC<ImagesSectionProps> = ({ 
  personas, 
  generatedMessages,
  selectedMessageTypes,
  adPlatform,
  offering = ""
}) => {
  // Format selection state
  const [selectedFormat, setSelectedFormat] = useState<string>("graphic-variety");
  
  // Filter out any null or undefined personas and messages
  const validPersonas = useMemo(() => personas.filter(Boolean), [personas]);
  const validMessageTypes = useMemo(() => selectedMessageTypes.filter(Boolean), [selectedMessageTypes]);
  
  // Calculate total number of persona-message pairs
  const totalPersonas = validPersonas.length;
  const totalMessageTypes = validMessageTypes.length;
  const totalPairs = useMemo(() => totalPersonas * totalMessageTypes, [totalPersonas, totalMessageTypes]);
  
  // State for tracking the current index
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  
  // Reset the index when personas or message types change
  useEffect(() => {
    // Only reset to 0 if current index is now out of bounds
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
  
  return (
    <CollapsibleSection title="IMAGES">
      {currentPersona ? (
        <div className="border-transparent rounded-md overflow-hidden bg-transparent">
          {/* Format selector moved to the top and centered */}
          <div className="p-4 border-transparent bg-transparent">
            <FormatSelector 
              selectedFormat={selectedFormat} 
              onFormatChange={setSelectedFormat} 
            />
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
          <div className="border-transparent bg-transparent">
            <ResolutionOptions adPlatform={adPlatform} />
          </div>
          <div className="border-transparent p-5 bg-white">
            <ImageGenerator 
              currentPersona={currentPersona} 
              adPlatform={adPlatform}
              offering={offering}
              imageFormat={selectedFormat}
            />
          </div>
        </div>
      ) : (
        <div className="p-4 bg-white rounded-md"></div>
      )}
    </CollapsibleSection>
  );
};

export default React.memo(ImagesSection);
