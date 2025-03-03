
import { Persona } from "../../Personas/types";
import { Message } from "../hooks/useMessagesFetching";

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
  personas.forEach((persona, index) => {
    // Use ID or index as key
    const personaId = persona.id ? String(persona.id) : `persona-${index}`;
    result[personaId] = {};
    
    messageTypes.forEach(type => {
      result[personaId][type] = {
        message_id: `${personaId}-${type}`,
        message_name: `Generated ${type} Example`,
        persona_id: personaId,
        message_type: type,
        created_at: new Date().toISOString(),
      };
    });
  });
  
  console.log("Generated messages result:", result);
  return result;
};

/**
 * Generate messages for a specific column (message type) for all personas.
 * This would normally call an API, but for now we're returning hardcoded examples.
 */
export const generateColumnMessages = async (
  messageType: string,
  personas: Persona[],
  existingMessages: GeneratedMessagesRecord
): Promise<GeneratedMessagesRecord> => {
  console.log(`generateColumnMessages called for type: ${messageType}`, {
    personasCount: personas.length
  });
  
  // Create a new object to avoid mutating the original
  const updatedMessages = { ...existingMessages };
  
  // For each persona, generate a message for the specified type
  personas.forEach((persona, index) => {
    // Use ID or index as key
    const personaId = persona.id ? String(persona.id) : `persona-${index}`;
    
    // Initialize persona entry if it doesn't exist
    if (!updatedMessages[personaId]) {
      updatedMessages[personaId] = {};
    }
    
    // Add or update message for this type
    updatedMessages[personaId][messageType] = {
      message_id: `${personaId}-${messageType}`,
      message_name: `Generated ${messageType} Example`,
      persona_id: personaId,
      message_type: messageType,
      created_at: new Date().toISOString(),
    };
  });
  
  return updatedMessages;
};
