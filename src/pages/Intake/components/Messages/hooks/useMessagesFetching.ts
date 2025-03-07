
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface Message {
  id?: string;
  content?: string;
  message_type?: string;
  message_name?: string;
  created_at?: string;
  persona_id?: string;
}

export const useMessagesFetching = (personaId: string | null, messageTypes: string[]) => {
  const enabled = !!personaId && messageTypes.length > 0;
  
  return useQuery({
    queryKey: ["messages", personaId, messageTypes],
    queryFn: async (): Promise<Message[]> => {
      if (!personaId || messageTypes.length === 0) {
        return [];
      }
      
      const { data, error } = await supabase
        .from("d1messages")
        .select("*")
        .eq("persona_id", personaId)
        .in("message_type", messageTypes);
      
      if (error) {
        toast.error("Error fetching messages");
        console.error("Error fetching messages:", error);
        throw error;
      }
      
      return data || [];
    },
    enabled
  });
};
