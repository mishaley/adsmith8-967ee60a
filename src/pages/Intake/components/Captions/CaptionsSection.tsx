
import React, { useState, useEffect } from "react";
import { Persona } from "../Personas/types";
import { Message } from "../Messages/hooks/useMessagesFetching";
import PersonaDisplay from "../Images/components/PersonaDisplay";
import CollapsibleSection from "../CollapsibleSection";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

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
  // State for caption text
  const [caption, setCaption] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  // Reset the index when personas or message types change
  useEffect(() => {
    console.log("CaptionsSection: Data changed", {
      validPersonas: validPersonas.length,
      validMessageTypes,
      totalPairs
    });
    
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

  const handleGenerateCaption = () => {
    setIsGenerating(true);
    // Simulate generation - in a real app, this would call an API
    setTimeout(() => {
      setCaption("This is a sample auto-generated caption for your advertisement. It highlights your product's key features and benefits.");
      setIsGenerating(false);
    }, 1000);
  };
  
  return (
    <CollapsibleSection title="CAPTIONS">
      {currentPersona ? (
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
          <div className="grid grid-cols-3 gap-4 p-4">
            {/* Three-column structure placeholder */}
            <div className="bg-gray-50 border rounded-md p-4">
              <div className="mb-4">
                <Textarea
                  placeholder="Enter or generate a caption for your advertisement"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleGenerateCaption}
                  disabled={isGenerating}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Wand2 className="h-4 w-4" />
                  {isGenerating ? "Generating..." : "Generate Caption"}
                </Button>
              </div>
            </div>
            <div className="bg-gray-50 border rounded-md p-4">
              {/* Empty column */}
            </div>
            <div className="bg-gray-50 border rounded-md p-4">
              {/* Empty column */}
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
