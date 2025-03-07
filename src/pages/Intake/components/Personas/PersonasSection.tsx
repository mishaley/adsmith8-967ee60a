
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import PersonasList from "./PersonasList";
import PortraitRow from "./PortraitRow";
import { Persona } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPortraitPrompt } from "./utils/portraitUtils";
import { Textarea } from "@/components/ui/textarea";

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
  const hasPersonas = personas && personas.length > 0;
  const [promptText, setPromptText] = useState<string>("");
  
  const handleCountChange = (value: string) => {
    if (setPersonaCount) {
      const count = parseInt(value, 10);
      setPersonaCount(count);
    }
  };
  
  // Update the prompt text whenever personas change
  useEffect(() => {
    if (hasPersonas && personas[0]) {
      const samplePrompt = createPortraitPrompt(personas[0]);
      setPromptText(samplePrompt);
    } else {
      setPromptText("");
    }
  }, [personas, hasPersonas]);
  
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
      
      {/* Prompt Text Area */}
      {hasPersonas && (
        <tr className="border-transparent">
          <td colSpan={2} className="pb-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Portrait Generation Prompt:
              </label>
              <Textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Portrait generation prompt will appear here..."
                className="w-full h-24 text-sm font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                This is the prompt that will be sent to Ideogram when generating portraits.
                You can edit it to customize the portrait generation.
              </p>
            </div>
          </td>
        </tr>
      )}
      
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
                  <PortraitRow 
                    personas={personas} 
                    isGeneratingPortraits={isGeneratingPortraits} 
                    loadingIndices={loadingPortraitIndices} 
                    onRetryPortrait={retryPortraitGeneration} 
                    promptText={promptText}
                  />
                </tbody>
              </table>
            </div>
          </td>
        </tr> : null}
    </>;
};

export default PersonasSection;
