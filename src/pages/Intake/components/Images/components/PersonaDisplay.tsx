
import React from "react";
import { Persona } from "../../Personas/types";
import { Message } from "../../Messages/hooks/useMessagesFetching";

interface PersonaDisplayProps {
  currentPersona: Persona | null;
  currentMessageType: string;
  messageContent: string;
  displayIndex: number;
  totalPairs: number;
  goToPrevious: () => void;
  goToNext: () => void;
}

const PersonaDisplay: React.FC<PersonaDisplayProps> = ({
  currentPersona,
  currentMessageType,
  messageContent,
  displayIndex,
  totalPairs,
  goToPrevious,
  goToNext
}) => {
  if (!currentPersona) {
    return (
      <td colSpan={2} className="p-4 text-center text-gray-500">
        No personas available to display
      </td>
    );
  }

  return (
    <div className="flex">
      {/* Left Column - Navigation and Counter */}
      <div className="flex flex-row items-center justify-start pr-4 w-24">
        <button 
          onClick={goToPrevious}
          disabled={totalPairs <= 1}
          className="h-7 w-7 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        
        {/* Index counter box - now in numerator/denominator format */}
        <div className="bg-gray-100 border border-gray-300 rounded-md px-2 py-1 mx-1 flex flex-col items-center justify-center">
          <span className="text-xs font-medium border-b border-gray-400 pb-[2px]">{displayIndex}</span>
          <span className="text-xs font-medium pt-[2px]">{totalPairs}</span>
        </div>
        
        <button 
          onClick={goToNext}
          disabled={totalPairs <= 1}
          className="h-7 w-7 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>
      
      {/* Right Column - Content */}
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
    </div>
  );
};

export default PersonaDisplay;
