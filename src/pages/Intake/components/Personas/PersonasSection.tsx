
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import PersonasList from "./PersonasList";
import PortraitRow from "./PortraitRow";
import { Persona } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PersonasSectionProps {
  personas: Persona[];
  summary: string;
  isGeneratingPersonas: boolean;
  isGeneratingPortraits: boolean;
  generatePersonas: () => void;
  updatePersona?: (index: number, updatedPersona: Persona) => void;
  loadingPortraitIndices?: number[];
  retryPortraitGeneration?: (index: number) => void;
  removePersona?: (index: number) => void;
  personaCount?: number;
  setPersonaCount?: (count: number) => void;
}

const PersonasSection: React.FC<PersonasSectionProps> = ({
  personas,
  summary,
  isGeneratingPersonas,
  isGeneratingPortraits,
  generatePersonas,
  updatePersona,
  loadingPortraitIndices = [],
  retryPortraitGeneration,
  removePersona,
  personaCount = 1,
  setPersonaCount
}) => {
  console.log("PersonasSection rendering with personas:", personas, "and personaCount:", personaCount);
  
  const hasPersonas = personas && personas.length > 0;
  const hasLoadingPortraits = loadingPortraitIndices.length > 0;
  const numPortraitsNeeded = personas.filter(p => !p.portraitUrl).length;
  const numPortraitsLoading = loadingPortraitIndices.length;
  
  // Monitor loading states for debugging
  useEffect(() => {
    console.log("PersonasSection state update:", {
      hasPersonas,
      isGeneratingPersonas,
      isGeneratingPortraits,
      hasLoadingPortraits,
      loadingPortraitIndices,
      personaCount,
      portraitUrls: personas.map(p => !!p?.portraitUrl)
    });
  }, [personas, isGeneratingPersonas, isGeneratingPortraits, loadingPortraitIndices, personaCount]);

  const handleCountChange = (value: string) => {
    if (setPersonaCount) {
      const count = parseInt(value, 10);
      console.log(`Persona count changed to: ${count}`);
      setPersonaCount(count);
    }
  };

  return (
    <>
      <tr className="border-b">
        <td colSpan={2} className="py-4 text-lg">
          <div className="w-full text-left pl-4 flex items-center">
            <span>Personas</span>
            
            {setPersonaCount && (
              <div className="ml-4 w-20">
                <Select value={personaCount.toString()} onValueChange={handleCountChange}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Count" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <Button 
              onClick={generatePersonas} 
              disabled={isGeneratingPersonas || isGeneratingPortraits}
              className="ml-4"
              size="sm"
            >
              {isGeneratingPersonas ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Generating Personas...
                </>
              ) : (
                "Generate"
              )}
            </Button>
            {(isGeneratingPortraits || hasLoadingPortraits) && !isGeneratingPersonas && (
              <div className="ml-4 text-sm text-blue-500 flex items-center font-medium">
                <Loader className="h-3 w-3 animate-spin mr-2" />
                Generating portraits... {numPortraitsLoading > 0 ? `(${numPortraitsLoading} of ${numPortraitsNeeded})` : ''}
              </div>
            )}
          </div>
        </td>
      </tr>
      {isGeneratingPersonas && !hasPersonas ? (
        <tr>
          <td colSpan={2} className="py-8 text-center bg-transparent">
            <Loader className="h-8 w-8 animate-spin mx-auto" />
            <div className="mt-4 text-gray-500">Generating personas...</div>
          </td>
        </tr>
      ) : hasPersonas ? (
        <tr>
          <td colSpan={2} className="p-0">
            <div className="w-full">
              <table className="w-full border-collapse">
                <tbody>
                  <PersonasList 
                    personas={personas} 
                    onRemovePersona={removePersona}
                  />
                  <PortraitRow 
                    personas={personas}
                    isGeneratingPortraits={isGeneratingPortraits}
                    loadingIndices={loadingPortraitIndices}
                    onRetryPortrait={retryPortraitGeneration}
                  />
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
};

export default PersonasSection;
