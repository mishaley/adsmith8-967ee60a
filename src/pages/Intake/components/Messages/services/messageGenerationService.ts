
import { Persona } from "../../Personas/types";
import { Message } from "../hooks/useMessagesFetching";
import { GeneratedMessagesRecord } from "../hooks/useMessagesState";
import { toast } from "sonner";

// Mock message generation function
export const generateMessagesForAllPersonas = async (
  personas: Persona[],
  messageTypes: string[],
  userProvidedMessage: string
): Promise<GeneratedMessagesRecord> => {
  console.log(`Generating messages for ${personas.length} personas and ${messageTypes.length} message types`);
  
  // Create a new record to store all messages
  const messages: GeneratedMessagesRecord = {};
  
  try {
    // For each persona, generate a message for each message type
    for (const persona of personas) {
      if (!persona.id) {
        console.warn("Persona without ID encountered, skipping");
        continue;
      }
      
      console.log(`Generating messages for persona: ${persona.id}`);
      
      // Initialize the record for this persona if it doesn't exist
      if (!messages[persona.id]) {
        messages[persona.id] = {};
      }
      
      // For each message type, generate a message
      for (const messageType of messageTypes) {
        // If user-provided and a message was provided, use that
        if (messageType === "user-provided" && userProvidedMessage) {
          messages[persona.id][messageType] = {
            message_id: `${persona.id}-${messageType}`,
            message_name: userProvidedMessage,
            message_type: messageType,
            message_url: "",
            message_status: "Generated",
            persona_id: persona.id
          };
        } else {
          // Generate a mock message based on persona and message type
          const mockMessage = generateMockMessage(persona, messageType);
          messages[persona.id][messageType] = {
            message_id: `${persona.id}-${messageType}`,
            message_name: mockMessage,
            message_type: messageType,
            message_url: "",
            message_status: "Generated",
            persona_id: persona.id
          };
        }
      }
    }
    
    console.log("Generated messages:", messages);
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
  
  // Create a deep copy of the existing messages
  const updatedMessages = JSON.parse(JSON.stringify(existingMessages)) as GeneratedMessagesRecord;
  
  try {
    let generationCount = 0;
    
    // For each persona, generate a message for this message type
    for (const persona of personas) {
      if (!persona.id) {
        console.warn("Persona without ID encountered, skipping");
        continue;
      }
      
      console.log(`Generating ${messageType} message for persona: ${persona.id}`);
      
      // Initialize the record for this persona if it doesn't exist
      if (!updatedMessages[persona.id]) {
        updatedMessages[persona.id] = {};
      }
      
      // Generate a mock message based on persona and message type
      const mockMessage = generateMockMessage(persona, messageType);
      updatedMessages[persona.id][messageType] = {
        message_id: `${persona.id}-${messageType}`,
        message_name: mockMessage,
        message_type: messageType,
        message_url: "",
        message_status: "Generated",
        persona_id: persona.id
      };
      
      generationCount++;
    }
    
    console.log(`Generated ${generationCount} messages for ${messageType}`);
    console.log("Updated messages:", updatedMessages);
    toast.success(`Generated messages for ${messageType}`);
    return updatedMessages;
  } catch (error) {
    console.error("Error generating column messages:", error);
    toast.error(`Failed to generate ${messageType} messages. Please try again.`);
    return existingMessages;
  }
};

// Helper function to generate a mock message based on persona and message type
const generateMockMessage = (persona: Persona, messageType: string): string => {
  const prefix = persona.name || `${persona.gender}, ${persona.ageMin}-${persona.ageMax}`;
  
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
