
import { useState } from "react";

export const usePersonaMessageData = () => {
  // Initialize persona and message selections
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<string[]>([]);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  
  // Placeholder options for personas and messages
  const personaOptions = [
    { value: "persona-1", label: "Persona 1" },
    { value: "persona-2", label: "Persona 2" }
  ];
  
  const messageOptions = [
    { value: "headline", label: "Headline" },
    { value: "description", label: "Description" }
  ];

  // Determine disabled states
  const isPersonasDisabled = (selectedOfferingId: string) => !selectedOfferingId;
  const isMessagesDisabled = selectedPersonaIds.length === 0;

  return {
    selectedPersonaIds,
    setSelectedPersonaIds,
    selectedMessageIds,
    setSelectedMessageIds,
    personaOptions,
    messageOptions,
    isPersonasDisabled,
    isMessagesDisabled
  };
};
