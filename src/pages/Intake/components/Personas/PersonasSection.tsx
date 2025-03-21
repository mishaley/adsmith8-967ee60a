import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader, AlertCircle } from "lucide-react";
import PersonasList from "./PersonasList";
import PortraitRow from "./PortraitRow";
import { Persona } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { logDebug, logError } from "@/utils/logging";
import PersonaToggle from "./components/PersonaToggle";
import SingleSelectField from "../SummaryTable/components/SingleSelectField";
import { usePersonaSelection } from "../SummaryTable/hooks/usePersonaSelection";
import { useToast } from "@/components/ui/use-toast";
import { useMessagesState } from "../Messages/hooks/useMessagesState";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  setSelectedPersonaId?: (value: string) => void;
  selectedPersonaId?: string; // Add this new prop
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
  setSelectedPersonaId,
  selectedPersonaId, // Add this new prop
  selectedOfferingId = "",
}) => {
  const { toast } = useToast();

  // Use the persona selection hook with proper offering ID
  const {
    personaOptions,
    isPersonasDisabled,
    isLoading,
    isError,
    error,
    refetch,
  } = usePersonaSelection(selectedOfferingId || "");

  const filteredPersonaOptions = personaOptions.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.label === value.label) // Filter by "label"
  );
  // Reset selected persona when offering changes
  useEffect(() => {
    if (selectedPersonaId) {
      setSelectedPersonaId("");
      logDebug(
        `PersonasSection - offering changed, cleared persona selection`,
        "ui"
      );
    }
    logDebug(
      `PersonasSection - offering changed to: ${selectedOfferingId}`,
      "ui"
    );
  }, [selectedOfferingId]);

  // Log debug information
  useEffect(() => {
    logDebug(`PersonasSection rendered:`, "ui");
    logDebug(`- selectedOfferingId: ${selectedOfferingId}`, "ui");
    logDebug(`- isPersonasDisabled: ${isPersonasDisabled}`, "ui");
    logDebug(`- personaOptions: ${personaOptions.length}`, "ui");
    logDebug(`- selectedPersonaId: ${selectedPersonaId}`, "ui");
  }, [
    selectedOfferingId,
    isPersonasDisabled,
    personaOptions.length,
    selectedPersonaId,
  ]);

  // Handle errors with toast notification
  useEffect(() => {
    if (isError && error) {
      toast({
        title: "Error loading personas",
        description: "There was a problem loading personas. Please try again.",
        variant: "destructive",
      });
      logError("Persona loading error:", "ui", error);
    }
  }, [isError, error, toast]);

  // Listen for offeringChanged events
  useEffect(() => {
    const handleOfferingChanged = (event: CustomEvent) => {
      if (selectedPersonaId) {
        setSelectedPersonaId("");
        logDebug(
          "Offering changed via event - clearing persona selection",
          "ui"
        );
      }
    };

    window.addEventListener(
      "offeringChanged",
      handleOfferingChanged as EventListener
    );
    return () => {
      window.removeEventListener(
        "offeringChanged",
        handleOfferingChanged as EventListener
      );
    };
  }, [selectedPersonaId]);

  const handleCountChange = (value: string) => {
    if (setPersonaCount) {
      const count = parseInt(value, 10);
      setPersonaCount(count);
    }
  };

  const handlePersonaChange = (value: string) => {
    logDebug(`Persona selection changed to: ${value}`, "ui");
    setSelectedPersonaId(value);
  };

  const showPersonaCreationContent = selectedPersonaId === "new-offering";

  const { data: personasToMap = [], refetch: refetchPersonas } = useQuery({
    queryKey: ["persona_by_name", selectedPersonaId],
    queryFn: async () => {
      if (!selectedPersonaId || selectedPersonaId === "new-offering") return [];
      const name =
        filteredPersonaOptions?.find(({ value }) => value === selectedPersonaId)
          ?.label || "";
      const { data, error } = await supabase
        .from("c1personas")
        .select("*")
        .eq("persona_name", name);

      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: Boolean(selectedPersonaId),
  });
  console.log({ personasToMap });

  useEffect(() => {
    if (selectedPersonaId !== "new-offering") {
      refetchPersonas();
    }
  }, [selectedPersonaId]);

  const hasPersonas = personasToMap
    ? personasToMap?.length > 0
    : personas.length > 0;
  console.log(personas);

  const personaFormatter = personasToMap?.map((node: any) => {
    return {
      id: node?.persona_id,
      title: "",
      description: "",
      imageUrl: "",
      portraitUrl: node?.portraitUrl || "",
      gender: node?.persona_gender,
      age: `${node?.persona_agemax} - ${node?.persona_agemin}`,
      ageMin: node?.persona_agemax,
      ageMax: node?.persona_agemin,
      occupation: "",
      interests: node?.persona_interests,
      race: "",
      persona_id: node?.persona_id,
      persona_interests: node?.persona_interests,
      persona_demographics: node?.persona_demographics,
    };
  });
  return (
    <>
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
                options={filteredPersonaOptions}
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
            <td colSpan={2} className="py-4 text-center">
              <div className="w-full flex justify-center items-center">
                {setPersonaCount && (
                  <div className="w-20 mr-4">
                    <Select
                      value={personaCount.toString()}
                      onValueChange={handleCountChange}
                    >
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
                  </div>
                )}

                <Button
                  onClick={generatePersonas}
                  disabled={isGeneratingPersonas || isGeneratingPortraits}
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
              </div>
            </td>
          </tr>

          {isGeneratingPersonas && !hasPersonas ? (
            <tr className="border-transparent">
              <td colSpan={2} className="py-8 text-center bg-transparent">
                <Loader className="h-8 w-8 animate-spin mx-auto" />
                <div className="mt-4 text-gray-500">Generating personas...</div>
              </td>
            </tr>
          ) : hasPersonas ? (
            <tr className="border-transparent">
              <td colSpan={2} className="p-0">
                <div className="w-full">
                  <table className="w-full border-collapse border-transparent">
                    <tbody>
                      <PersonasList
                        personas={(personas || personasToMap) as any}
                        onRemovePersona={removePersona}
                        personaCount={personaCount}
                      />
                      <PortraitRow
                        personas={(personas || personasToMap) as any}
                        isGeneratingPortraits={isGeneratingPortraits}
                        loadingIndices={loadingPortraitIndices}
                        onRetryPortrait={retryPortraitGeneration}
                        personaCount={personaCount}
                      />
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          ) : null}
        </>
      )}

      {!showPersonaCreationContent && hasPersonas && (
        <tr className="border-transparent">
          <td colSpan={2} className="p-0">
            <div className="w-full">
              <table className="w-full border-collapse border-transparent">
                <tbody>
                  <PersonasList
                    personas={personaFormatter as any}
                    onRemovePersona={removePersona}
                    personaCount={personaCount}
                  />
                  <PortraitRow
                    personas={personaFormatter as any}
                    isGeneratingPortraits={isGeneratingPortraits}
                    loadingIndices={loadingPortraitIndices}
                    onRetryPortrait={retryPortraitGeneration}
                    personaCount={personaCount}
                  />
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default PersonasSection;
