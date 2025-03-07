
import { Persona } from "../../Personas/types";
import { Message } from "../hooks/useMessagesFetching";
import { supabase } from "@/integrations/supabase/client";

// Simplified type definition to avoid deep nesting
export type GeneratedMessagesRecord = Record<string, Record<string, Message>>;

/**
 * Generate messages for all personas and all selected message types.
 */
export const generateMessagesForAllPersonas = async (
  personas: Persona[],
  messageTypes: string[],
  userProvidedMessage: string
): Promise<GeneratedMessagesRecord> => {
  const result: GeneratedMessagesRecord = {};
  
  // For each persona, generate messages for each selected type
  for (const persona of personas) {
    // Use ID or index as key
    const personaId = persona.id ? String(persona.id) : `persona-${personas.indexOf(persona)}`;
    result[personaId] = {};
    
    for (const type of messageTypes) {
      try {
        // Call our edge function to generate a tagline
        const { data, error } = await supabase.functions.invoke('generate-marketing-taglines', {
          body: { messageType: type, persona }
        });
        
        if (error) {
          console.error("Error from edge function:", error);
          throw error;
        }
        
        // Use the generated tagline or a fallback
        const tagline = data?.tagline || `Generated ${type} Example`;
        
        result[personaId][type] = {
          id: `${personaId}-${type}`,
          message_name: tagline,
          persona_id: personaId,
          message_type: type,
          created_at: new Date().toISOString(),
        };
      } catch (error) {
        console.error(`Error generating ${type} message for persona ${personaId}:`, error);
        
        // Use a fallback message
        result[personaId][type] = {
          id: `${personaId}-${type}`,
          message_name: `Generated ${type} Example`,
          persona_id: personaId,
          message_type: type,
          created_at: new Date().toISOString(),
        };
      }
    }
  }
  
  return result;
};

/**
 * Generate messages for a specific column (message type) for all personas.
 */
export const generateColumnMessages = async (
  messageType: string,
  personas: Persona[],
  existingMessages: GeneratedMessagesRecord
): Promise<GeneratedMessagesRecord> => {
  const updatedMessages = { ...existingMessages };
  
  for (const persona of personas) {
    const personaId = persona.id ? String(persona.id) : `persona-${personas.indexOf(persona)}`;
    
    if (!updatedMessages[personaId]) {
      updatedMessages[personaId] = {};
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-marketing-taglines', {
        body: { messageType, persona }
      });
      
      if (error) {
        console.error("Error from edge function:", error);
        throw error;
      }
      
      const tagline = data?.tagline || `Generated ${messageType} Example`;
      
      // Create a new message object for this type and persona
      updatedMessages[personaId][messageType] = {
        id: `${personaId}-${messageType}`,
        message_name: tagline,
        message_type: messageType,
        persona_id: personaId,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error generating ${messageType} message for persona ${personaId}:`, error);
      
      updatedMessages[personaId][messageType] = {
        id: `${personaId}-${messageType}`,
        message_name: `Generated ${messageType} Example`,
        message_type: messageType,
        persona_id: personaId,
        created_at: new Date().toISOString()
      };
    }
  }
  
  return updatedMessages;
};
