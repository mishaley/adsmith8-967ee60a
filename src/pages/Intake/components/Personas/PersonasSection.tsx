
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import PersonasList from "./PersonasList";
import PortraitRow from "./PortraitRow";
import { Persona } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MultiSelectField from "../SummaryTable/components/MultiSelectField";
import { useSummaryTableData } from "../SummaryTable/useSummaryTableData";

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

  // Get persona dropdown data from summary table hook
  const {
    selectedPersonaIds,
    setSelectedPersonaIds,
    personaOptions,
    isPersonasDisabled
  } = useSummaryTableData();

  // Monitor loading states for debugging
  useEffect(() => {
    console.log("PersonasSection state update:", {
      hasPersonas,
      isGeneratingPersonas,
      isGeneratingPortraits,
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
  
  return <>
      <tr className="border-transparent">
        <td colSpan={2} className="py-4 text-center">
          <div className="w-full flex justify-center items-center">
            {setPersonaCount && <div className="w-20 mr-4">
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
              </div>}
            
            <Button onClick={generatePersonas} disabled={isGeneratingPersonas || isGeneratingPortraits} size="sm">
              {isGeneratingPersonas ? <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Generating Personas...
                </> : "Generate"}
            </Button>
          </div>
        </td>
      </tr>

      {/* Add persona dropdown here */}
      <tr className="border-transparent">
        <td colSpan={2} className="py-2 text-center">
          <div className="w-72 mx-auto">
            <MultiSelectField
              options={personaOptions}
              value={selectedPersonaIds}
              onChange={setSelectedPersonaIds}
              disabled={isPersonasDisabled}
              placeholder="Select personas"
            />
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
                  <PersonasList personas={personas} onRemovePersona={removePersona} />
                  <PortraitRow personas={personas} isGeneratingPortraits={isGeneratingPortraits} loadingIndices={loadingPortraitIndices} onRetryPortrait={retryPortraitGeneration} />
                </tbody>
              </table>
            </div>
          </td>
        </tr> : null}
    </>;
};

export default PersonasSection;
