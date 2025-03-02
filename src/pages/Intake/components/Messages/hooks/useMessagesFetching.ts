
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define the Message type to match what's expected in MessagesList.tsx
export interface Message {
  message_id: string;
  message_name: string;
  message_type: string;
  message_url: string;
  message_status: string;
  persona_id?: string;
}

export const useMessagesFetching = (selectedPersonaId: string, selectedMessageTypes: string[]) => {
  const messageTypeString = selectedMessageTypes.join(',');
  
  return useQuery({
    queryKey: ["messages", selectedPersonaId, messageTypeString],
    queryFn: async () => {
      if (!selectedMessageTypes.length) return [];
      
      const { data } = await supabase
        .from("d1messages")
        .select("*")
        .eq("persona_id", selectedPersonaId || "none")
        .in("message_type", selectedMessageTypes as any); // Use type assertion to fix type error
      
      // Return the data directly as it already matches our Message interface
      return (data || []) as Message[];
    },
    enabled: !!selectedPersonaId && selectedMessageTypes.length > 0
  });
};
