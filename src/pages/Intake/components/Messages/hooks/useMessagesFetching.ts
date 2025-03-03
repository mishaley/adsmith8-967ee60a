import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Message {
  id?: string;
  personaId: string;
  type: string;
  content: string;
  created_at?: string;
}

export const useMessagesFetching = (personaId: string | null, messageTypes: string[]) => {
  const messageTypeString = messageTypes.join(',');
  
  return useQuery({
    queryKey: ["messages", personaId, messageTypeString],
    queryFn: async () => {
      if (!messageTypes.length) return [];
      
      const { data } = await supabase
        .from("d1messages")
        .select("*")
        .eq("persona_id", personaId || "none")
        .in("message_type", messageTypes as any); // Use type assertion to fix type error
      
      // Return the data directly as it already matches our Message interface
      return (data || []) as Message[];
    },
    enabled: !!personaId && messageTypes.length > 0
  });
};
