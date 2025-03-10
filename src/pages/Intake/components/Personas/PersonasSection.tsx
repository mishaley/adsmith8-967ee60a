
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import PersonasList from "./PersonasList";
import PortraitRow from "./PortraitRow";
import { Persona } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { logDebug } from "@/utils/logging";

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
  isGeneratingPortraits = false,
  generatePersonas,
  updatePersona,
  loadingPortraitIndices = [],
  retryPortraitGeneration,
  removePersona,
  personaCount = 1,
  setPersonaCount
}) => {
  const hasPersonas = personas && personas.length > 0;
  
  // Log personas data for debugging
  React.useEffect(() => {
    logDebug(`PersonasSection rendered with ${personas?.length || 0} personas, hasPersonas=${hasPersonas}`);
    if (personas?.length > 0) {
      logDebug("First persona data:", JSON.stringify(personas[0]));
    }
  }, [personas, hasPersonas]);
  
  const handleCountChange = (value: string) => {
    if (setPersonaCount) {
      const count = parseInt(value, 10);
      setPersonaCount(count);
    }
  };
  
  return <>
      <tr className="border-transparent">
        <td colSpan={2} className="py-4 text-center">
          <div className="w-full flex justify-center items-center">
            {setPersonaCount && <div className="w-20 mr-4">
                <Select value={personaCount.toString()} onValueChange={handleCountChange}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>}
            
            <Button onClick={generatePersonas} disabled={isGeneratingPersonas} size="sm">
              {isGeneratingPersonas ? <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Generating Personas...
                </> : "Generate"}
            </Button>
          </div>
        </td>
      </tr>
      
      {isGeneratingPersonas && !hasPersonas ? <tr className="border-transparent">
          <td colSpan={2} className="py-8 text-center bg-transparent">
            <Loader className="h-8 w-8 animate-spin mx-auto" />
            <div className="mt-4 text-gray-500">Generating personas...</div>
          </td>
        </tr> : hasPersonas ? <tr className="border-transparent">
          <td colSpan={2} className="p-0">
            <div className="w-full">
              <table className="w-full border-collapse border-transparent">
                <tbody>
                  <PersonasList 
                    personas={personas} 
                    onRemovePersona={removePersona}
                    personaCount={personaCount}
                  />
                  <PortraitRow 
                    personas={personas} 
                    isGeneratingPortraits={isGeneratingPortraits} 
                    loadingIndices={loadingPortraitIndices} 
                    personaCount={personaCount}
                  />
                </tbody>
              </table>
            </div>
          </td>
        </tr> : null}
    </>;
};

export default PersonasSection;
