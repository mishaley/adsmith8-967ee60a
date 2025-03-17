
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader, AlertCircle } from "lucide-react";
import PersonasList from "./PersonasList";
import PortraitRow from "./PortraitRow";
import { Persona } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { logDebug, logError } from "@/utils/logging";
import PersonaToggle from "./components/PersonaToggle";
import SingleSelectField from "../SummaryTable/components/SingleSelectField";
import { usePersonaSelection } from "../SummaryTable/hooks/usePersonaSelection";
import { useToast } from "@/components/ui/use-toast";

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
  isSegmented?: boolean;
  setIsSegmented?: (isSegmented: boolean) => void;
  selectedOfferingId?: string;
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
  setPersonaCount,
  isSegmented = true,
  setIsSegmented,
  selectedOfferingId = ""
}) => {
  const { toast } = useToast();
  const hasPersonas = personas && personas.length > 0;
  const [selectedPersonaId, setSelectedPersonaId] = useState("");
  
  // Use the persona selection hook with proper offering ID
  const { 
    personaOptions, 
    isPersonasDisabled,
    isLoading,
    isError,
    error
  } = usePersonaSelection(selectedOfferingId || "");
  
  // Reset selected persona when offering changes
  useEffect(() => {
    setSelectedPersonaId("");
    logDebug(`PersonasSection - offering changed to: ${selectedOfferingId}`, 'ui');
  }, [selectedOfferingId]);
  
  // Log debug information
  useEffect(() => {
    logDebug(`PersonasSection rendered:`, 'ui');
    logDebug(`- selectedOfferingId: ${selectedOfferingId}`, 'ui');
    logDebug(`- isPersonasDisabled: ${isPersonasDisabled}`, 'ui');
    logDebug(`- personaOptions: ${personaOptions.length}`, 'ui');
  }, [selectedOfferingId, isPersonasDisabled, personaOptions.length]);
  
  // Handle errors with toast notification
  useEffect(() => {
    if (isError && error) {
      toast({
        title: "Error loading personas",
        description: "There was a problem loading personas. Please try again.",
        variant: "destructive"
      });
      logError("Persona loading error:", 'ui', error);
    }
  }, [isError, error, toast]);

  const handleCountChange = (value: string) => {
    if (setPersonaCount) {
      const count = parseInt(value, 10);
      setPersonaCount(count);
    }
  };

  const handlePersonaChange = (value: string) => {
    logDebug(`Persona selection changed to: ${value}`, 'ui');
    setSelectedPersonaId(value);
  };

  const showPersonaCreationContent = selectedPersonaId === "new-offering";
  
  return <>
      {/* Add the Persona Dropdown */}
      <tr className="border-transparent">
        <td colSpan={2} className="py-2 text-center">
          <div className="w-72 mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-2">
                <Loader className="h-4 w-4 animate-spin mr-2" />
                <span>Loading personas...</span>
              </div>
            ) : isError ? (
              <div className="flex items-center justify-center py-2 text-red-500">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span>Error loading personas</span>
              </div>
            ) : (
              <SingleSelectField
                options={personaOptions}
                value={selectedPersonaId}
                onChange={handlePersonaChange}
                disabled={isPersonasDisabled}
                placeholder=""
                showNewOption={!isPersonasDisabled}
                newOptionLabel="+ NEW PERSONA"
              />
            )}
          </div>
        </td>
      </tr>
      
      {/* Only show the toggle and content when "NEW PERSONA" is selected */}
      {showPersonaCreationContent && (
        <>
          {/* Add the Persona Toggle */}
          <tr className="border-transparent">
            <td colSpan={2} className="py-2 text-center">
              {setIsSegmented && (
                <PersonaToggle 
                  isSegmented={isSegmented} 
                  onToggleChange={setIsSegmented} 
                />
              )}
            </td>
          </tr>
          
          {/* Only show the content when isSegmented is true */}
          {isSegmented && (
            <>
              <tr className="border-transparent">
                <td colSpan={2} className="py-4 text-center">
                  <div className="w-full flex justify-center items-center">
                    {setPersonaCount && <div className="w-20 mr-4">
                        <Select value={personaCount.toString()} onValueChange={handleCountChange}>
                          <SelectTrigger className="bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white z-[100]">
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
            </>
          )}
          
          {/* Empty space when General Population is selected */}
          {!isSegmented && (
            <tr className="border-transparent">
              <td colSpan={2} className="py-8"></td>
            </tr>
          )}
        </>
      )}
    </>;
};

export default PersonasSection;
