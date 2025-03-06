
import { Persona } from "../../Personas/types";
import { Message } from "../hooks/useMessagesFetching";
import { supabase } from "@/integrations/supabase/client";

// Simplified type definition to avoid deep nesting
export type GeneratedMessagesRecord = Record<string, Record<string, Message>>;

/**
 * Generate messages for all personas and all selected message types.
 * This would normally call an API, but for now we're returning hardcoded examples.
 */
export const generateMessagesForAllPersonas = async (
  personas: Persona[],
  messageTypes: string[],
  userProvidedMessage: string
): Promise<GeneratedMessagesRecord> => {
  console.log("generateMessagesForAllPersonas called with:", {
    personasCount: personas.length,
    messageTypes,
    userProvidedMessage: userProvidedMessage ? "provided" : "not provided"
  });
  
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
        
        console.log("Edge function response:", data);
        
        // Use the generated tagline or a fallback
        const tagline = data?.tagline || `Generated ${type} Example`;
        
        result[personaId][type] = {
          message_id: `${personaId}-${type}`,
          message_name: tagline,
          persona_id: personaId,
          message_type: type,
          created_at: new Date().toISOString(),
        };
        
        console.log(`Successfully generated message for ${personaId}/${type}:`, result[personaId][type]);
      } catch (error) {
        console.error(`Error generating ${type} message for persona ${personaId}:`, error);
        
        // Use a fallback message
        result[personaId][type] = {
          message_id: `${personaId}-${type}`,
          message_name: `Generated ${type} Example`,
          persona_id: personaId,
          message_type: type,
          created_at: new Date().toISOString(),
        };
      }
    }
  }
  
  console.log("Generated messages result:", JSON.stringify(result, null, 2));
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
  console.log(`generateColumnMessages called for type: ${messageType}`, {
    personasCount: personas.length,
    existingMessagesStructure: JSON.stringify(existingMessages, null, 2)
  });
  
  const updatedMessages = { ...existingMessages };
  
  for (const persona of personas) {
    const personaId = persona.id ? String(persona.id) : `persona-${personas.indexOf(persona)}`;
    
    if (!updatedMessages[personaId]) {
      updatedMessages[personaId] = {};
    }
    
    try {
      console.log("Calling generate-marketing-taglines for:", { messageType, persona });
      const { data, error } = await supabase.functions.invoke('generate-marketing-taglines', {
        body: { messageType, persona }
      });
      
      if (error) {
        console.error("Error from edge function:", error);
        throw error;
      }
      
      console.log("Edge function response for column generation:", data);
      const tagline = data?.tagline || `Generated ${messageType} Example`;
      console.log(`Generated tagline for ${personaId}: "${tagline}"`);
      
      // Create a new message object for this type and persona
      updatedMessages[personaId][messageType] = {
        message_id: `${personaId}-${messageType}`,
        message_name: tagline,
        message_type: messageType,
        persona_id: personaId,
        created_at: new Date().toISOString()
      };

      console.log(`Updated message for persona ${personaId}:`, updatedMessages[personaId][messageType]);
    } catch (error) {
      console.error(`Error generating ${messageType} message for persona ${personaId}:`, error);
      
      updatedMessages[personaId][messageType] = {
        message_id: `${personaId}-${messageType}`,
        message_name: `Generated ${messageType} Example`,
        message_type: messageType,
        persona_id: personaId,
        created_at: new Date().toISOString()
      };
    }
  }
  
  console.log("Final updated messages:", JSON.stringify(updatedMessages, null, 2));
  return updatedMessages;
};
