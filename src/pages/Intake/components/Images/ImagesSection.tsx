
import React, { useState, useEffect } from "react";
import { Persona } from "../Personas/types";
import { Message } from "../Messages/hooks/useMessagesFetching";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { resolutionOptions } from "@/pages/Images/options";

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
  
  // Get the appropriate resolution options based on the ad platform
  const getResolutionsForPlatform = () => {
    const platformResolutions = {
      "Google": [
        { label: "1:1", value: "RESOLUTION_1024_1024" },
        { label: "4:5", value: "RESOLUTION_896_1120" },
        { label: "21:11", value: "RESOLUTION_1344_704" }
      ],
      "Meta": [
        { label: "1:1", value: "RESOLUTION_1024_1024" },
        { label: "4:5", value: "RESOLUTION_896_1120" },
        { label: "9:16", value: "RESOLUTION_720_1280" }
      ]
    };
    
    return adPlatform && platformResolutions[adPlatform] ? platformResolutions[adPlatform] : [];
  };
  
  // Calculate the number of images (placeholder for now)
  const getImageCountPlaceholder = () => 10;
  
  // Determine what to display in the third column
  const renderResolutionColumn = () => {
    if (!adPlatform) {
      return <span className="text-gray-500">Select an Ad Platform to see available resolutions</span>;
    }
    
    const resOptions = getResolutionsForPlatform();
    
    return (
      <div>
        <span className="font-medium">{adPlatform} - </span>
        {resOptions.map((res, index) => (
          <React.Fragment key={res.value}>
            <span>{res.label} ({getImageCountPlaceholder()}) </span>
            {index < resOptions.length - 1 && <span className="text-gray-400">• </span>}
          </React.Fragment>
        ))}
      </div>
    );
  };
  
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
                    <div className="flex">
                      {/* Left Column - Navigation and Counter */}
                      <div className="flex flex-row items-center justify-start pr-4 w-24">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={goToPrevious}
                          disabled={totalPairs <= 1}
                          className="h-7 w-7"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        
                        {/* Index counter box */}
                        <div className="bg-gray-100 border border-gray-300 rounded-md px-2 py-1 mx-1 flex items-center justify-center">
                          <span className="text-xs font-medium whitespace-nowrap">{displayIndex}/{totalPairs}</span>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={goToNext}
                          disabled={totalPairs <= 1}
                          className="h-7 w-7"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Middle Column - Content */}
                      <div className="flex items-center flex-1">
                        {/* Portrait - maintaining aspect ratio */}
                        {currentPersona.portraitUrl ? (
                          <img 
                            src={currentPersona.portraitUrl} 
                            alt="Persona portrait"
                            className="w-auto h-16 rounded-md object-cover mr-4"
                          />
                        ) : (
                          <div className="w-auto h-16 bg-gray-200 rounded-md flex items-center justify-center mr-4">
                            <span className="text-gray-500 text-xs">No image</span>
                          </div>
                        )}
                        
                        {/* Combined text with bullet point separators */}
                        <div className="flex-1">
                          <span className="text-lg text-gray-700">
                            {currentPersona.gender}, {currentPersona.ageMin}-{currentPersona.ageMax} • {currentPersona.interests?.join(", ") || "No interests"} • {messageContent}
                          </span>
                        </div>
                      </div>

                      {/* Right Column - Resolution options based on platform */}
                      <div className="flex items-center border-l pl-4 ml-4">
                        {renderResolutionColumn()}
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
