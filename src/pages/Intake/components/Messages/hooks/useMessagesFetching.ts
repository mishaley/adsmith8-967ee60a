
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define a simple message type to avoid deep nesting
interface Message {
  id: string;
  persona_id: string;
  type: string;
  content: string;
  // Add other fields as needed
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
        .in("type", selectedMessageTypes);
      
      return data || [];
    },
    enabled: !!selectedPersonaId && selectedMessageTypes.length > 0
  });
};
