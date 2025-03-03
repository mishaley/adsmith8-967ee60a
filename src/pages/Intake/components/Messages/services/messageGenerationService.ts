
import { Persona } from "../../Personas/types";
import { Message } from "../hooks/useMessagesFetching";
import { GeneratedMessagesRecord } from "../hooks/useMessagesState";
import { toast } from "sonner";

// Generate messages for all personas
export const generateMessagesForAllPersonas = async (
  personas: Persona[],
  messageTypes: string[],
  userProvidedMessage: string
): Promise<GeneratedMessagesRecord> => {
  console.log(`Generating messages for ${personas.length} personas and ${messageTypes.length} message types`);
  console.log("Personas:", personas.map(p => ({ id: p.id, name: p.name, idType: typeof p.id })));
  
  // Create a new record to store all messages
  const messages: GeneratedMessagesRecord = {};
  
  try {
    // For each persona, generate a message for each message type
    for (const persona of personas) {
      // Ensure persona ID is valid and convert to string if needed
      const personaId = persona.id ? String(persona.id) : null;
      
      if (!personaId) {
        console.warn("Persona without ID encountered, skipping", persona);
        continue;
      }
      
      console.log(`Generating messages for persona: ${personaId} (${persona.name || 'Unnamed'})`);
      
      // Initialize the record for this persona
      messages[personaId] = {};
      
      // For each message type, generate a message
      for (const messageType of messageTypes) {
        // If user-provided and a message was provided, use that
        if (messageType === "user-provided" && userProvidedMessage) {
          messages[personaId][messageType] = {
            message_id: `${personaId}-${messageType}`,
            message_name: userProvidedMessage,
            message_type: messageType,
            message_url: "",
            message_status: "Generated",
            persona_id: personaId
          };
        } else {
          // Generate a mock message based on persona and message type
          const mockMessage = generateMockMessage(persona, messageType);
          messages[personaId][messageType] = {
            message_id: `${personaId}-${messageType}`,
            message_name: mockMessage,
            message_type: messageType,
            message_url: "",
            message_status: "Generated",
            persona_id: personaId
          };
        }
      }
    }
    
    console.log("Generated messages structure:", JSON.stringify(messages, null, 2));
    toast.success("Generated messages for all personas");
    return messages;
  } catch (error) {
    console.error("Error generating messages:", error);
    toast.error("Failed to generate messages. Please try again.");
    return {};
  }
};

// Generate a message for a specific column (message type) for all personas
export const generateColumnMessages = async (
  messageType: string,
  personas: Persona[],
  existingMessages: GeneratedMessagesRecord
): Promise<GeneratedMessagesRecord> => {
  console.log(`Generating column messages for type: ${messageType}, personas count: ${personas.length}`);
  console.log("Personas for column generation:", personas.map(p => ({ 
    id: p.id, 
    idType: typeof p.id,
    name: p.name 
  })));
  
  // Create a deep copy of the existing messages
  const updatedMessages = JSON.parse(JSON.stringify(existingMessages || {})) as GeneratedMessagesRecord;
  
  try {
    let generationCount = 0;
    
    // For each persona, generate a message for this message type
    for (const persona of personas) {
      // Ensure persona ID is valid and convert to string if needed
      const personaId = persona.id ? String(persona.id) : null;
      
      if (!personaId) {
        console.warn("Persona without ID encountered, skipping", persona);
        continue;
      }
      
      console.log(`Generating ${messageType} message for persona with ID: ${personaId}`);
      
      // Initialize the record for this persona if it doesn't exist
      if (!updatedMessages[personaId]) {
        updatedMessages[personaId] = {};
      }
      
      // Generate a mock message based on persona and message type
      const mockMessage = generateMockMessage(persona, messageType);
      updatedMessages[personaId][messageType] = {
        message_id: `${personaId}-${messageType}`,
        message_name: mockMessage,
        message_type: messageType,
        message_url: "",
        message_status: "Generated",
        persona_id: personaId
      };
      
      generationCount++;
    }
    
    console.log(`Generated ${generationCount} messages for ${messageType}`);
    console.log("Updated messages structure:", JSON.stringify(updatedMessages, null, 2));
    toast.success(`Generated messages for ${messageType}`);
    return updatedMessages;
  } catch (error) {
    console.error("Error generating column messages:", error);
    toast.error(`Failed to generate ${messageType} messages. Please try again.`);
    return existingMessages || {};
  }
};

// Helper function to generate a mock message based on persona and message type
const generateMockMessage = (persona: Persona, messageType: string): string => {
  const name = persona.name || 'Unknown';
  const gender = persona.gender || 'Unknown';
  const age = `${persona.ageMin || '?'}-${persona.ageMax || '?'}`;
  const prefix = name !== 'Unknown' ? name : `${gender}, ${age}`;
  
  switch (messageType) {
    case "pain-point":
      return `${prefix} struggles with finding reliable solutions that don't waste time.`;
    case "unique-offering":
      return `${prefix} would appreciate our unique approach to solving their specific problems.`;
    case "value-prop":
      return `For ${prefix}, our solution saves 30% more time while delivering better results.`;
    case "user-provided":
      return `Custom message for ${prefix}.`;
    default:
      return `Generated message for ${prefix} (${messageType}).`;
  }
};
