
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define a simple message type that matches what we're using in the component
export interface Message {
  id: string;
  persona_id: string;
  type: string;
  content: string;
  // Add other fields as needed
}

// Create a mapping function to convert database records to our simplified Message type
const mapToMessage = (record: any): Message => ({
  id: record.message_id,
  persona_id: record.persona_id,
  type: record.message_type,
  content: record.message_url,
});

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
      
      // Map the database records to our simplified Message type
      return (data || []).map(mapToMessage);
    },
    enabled: !!selectedPersonaId && selectedMessageTypes.length > 0
  });
};
