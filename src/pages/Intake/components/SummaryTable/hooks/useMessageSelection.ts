
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMessageSelection = (
  selectedPersonaIds: string[], 
  isPersonasDisabled: boolean
) => {
  // Multi-select state for messages
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  
  // Reset message selection when personas change
  useEffect(() => {
    console.log("Personas changed to:", selectedPersonaIds);
    // When personas change or are cleared, reset messages
    setSelectedMessageIds([]);
  }, [selectedPersonaIds]);

  // Query messages based on selected personas
  const { data: messages = [] } = useQuery({
    queryKey: ["messages", selectedPersonaIds],
    queryFn: async () => {
      if (selectedPersonaIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from("d1messages")
        .select("message_id, message_name")
        .in("persona_id", selectedPersonaIds);
      
      if (error) throw error;
      return data || [];
    },
    enabled: selectedPersonaIds.length > 0, // Only run query if personas are selected
  });

  // Format options for the select component
  const messageOptions = messages.map(message => ({
    value: message.message_id,
    label: message.message_name
  }));

  // Determine disabled state
  const isMessagesDisabled = isPersonasDisabled || selectedPersonaIds.length === 0;

  return {
    selectedMessageIds,
    setSelectedMessageIds,
    messages,
    messageOptions,
    isMessagesDisabled
  };
};
