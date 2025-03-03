
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Message {
  id?: string;
  message_id?: string;
  persona_id?: string;
  personaId?: string;
  message_type?: string;
  type?: string;
  message_name?: string;
  content?: string;
  message_status?: string;
  status?: string;
  created_at?: string;
  message_url?: string;
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
        .in("message_type", messageTypes as any);
      
      // Map Supabase data to our Message interface to ensure compatibility
      return (data || []).map(item => ({
        id: item.message_id,
        message_id: item.message_id,
        personaId: item.persona_id,
        persona_id: item.persona_id,
        type: item.message_type,
        message_type: item.message_type,
        content: item.message_name,
        message_name: item.message_name,
        status: item.message_status,
        message_status: item.message_status,
        created_at: item.created_at,
        message_url: item.message_url
      })) as Message[];
    },
    enabled: !!personaId && messageTypes.length > 0
  });
};
