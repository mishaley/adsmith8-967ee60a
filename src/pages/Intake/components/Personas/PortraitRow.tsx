
import React from "react";
import { Persona } from "./types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface PortraitRowProps {
  personas: Persona[];
  isGeneratingPortraits: boolean;
  loadingIndices: number[];
  onRetryPortrait?: (index: number) => void;
  promptText?: string; // Add this prop
}

const PortraitRow: React.FC<PortraitRowProps> = ({ 
  personas, 
  isGeneratingPortraits, 
  loadingIndices, 
  onRetryPortrait,
  promptText  // Use this prop
}) => {
  const isLoading = (index: number) => loadingIndices.includes(index);
  
  return (
    <>
      {personas.map((persona, index) => (
        <tr key={index} className="border-transparent">
          <td className="w-1/2 py-2 px-4 border-transparent">
            <div className="flex items-center space-x-3">
              <Avatar>
                {persona.portraitUrl ? <AvatarImage src={persona.portraitUrl} alt={persona.gender} /> : <AvatarFallback>{persona.gender}</AvatarFallback>}
                
              </Avatar>
              <div>
                <div className="font-bold">{persona.gender}</div>
                <div className="text-sm opacity-50">{persona.race}</div>
              </div>
            </div>
          </td>
          <td className="w-1/2 py-2 px-4 border-transparent">
            {onRetryPortrait ? <Button 
                variant="outline" 
                size="sm"
                onClick={() => onRetryPortrait(index)}
                disabled={isGeneratingPortraits && !isLoading(index)}
              >
                {isLoading(index) ? <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </> : "Retry Portrait"}
              </Button> : null}
          </td>
        </tr>
      ))}
    </>
  );
};

export default PortraitRow;
