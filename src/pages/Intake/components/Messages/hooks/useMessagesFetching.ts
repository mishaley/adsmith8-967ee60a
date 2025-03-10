
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logError, logWarning, logDebug } from "@/utils/logging";

export interface Message {
  id?: string;
  content?: string;
  message_type?: string;
  message_name?: string;
  created_at?: string;
  persona_id?: string;
  message_id?: string;  // Added for compatibility
  type?: string;        // Added for compatibility
  status?: string;      // Added for compatibility
  message_status?: string; // Added for compatibility
}

// Helper to check if a string looks like a UUID
const isValidUUID = (id: string): boolean => {
  if (!id || typeof id !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

export const useMessagesFetching = (personaId: string | null, messageTypes: string[]) => {
  const enabled = !!personaId && messageTypes.length > 0;
  
  return useQuery({
    queryKey: ["messages", personaId, messageTypes],
    queryFn: async (): Promise<Message[]> => {
      if (!personaId || messageTypes.length === 0) {
        return [];
      }
      
      // Check if personaId is a UUID - many errors in the console come from trying to use
      // non-UUID values like "persona-0" with Supabase
      if (!isValidUUID(personaId)) {
        logWarning(`Attempted to fetch messages with non-UUID persona ID: ${personaId}`, 'api');
        return []; // Return empty array instead of making the query
      }
      
      logDebug(`Fetching messages for persona ${personaId} with types ${messageTypes.join(', ')}`, 'api');
      
      const { data, error } = await supabase
        .from("d1messages")
        .select("*")
        .eq("persona_id", personaId)
        .in("message_type", messageTypes as any); // Cast to any to bypass the type check
      
      if (error) {
        logError("Error fetching messages:", 'api', error);
        throw error;
      }
      
      return data || [];
    },
    enabled,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: (failureCount, error) => {
      // Don't retry certain types of errors
      if (error?.message?.includes('invalid input syntax for type uuid')) {
        return false;
      }
      return failureCount < 3;
    }
  });
};
