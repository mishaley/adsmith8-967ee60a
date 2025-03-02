
import { Persona } from "../../Personas/types";
import { getMessageContentByType } from "../messageUtils";
import { GeneratedMessagesRecord, Message } from "../hooks/useMessagesState";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const generateMessagesForAllPersonas = async (
  personas: Persona[], 
  selectedMessageTypes: string[], 
  userProvidedMessage: string
): Promise<GeneratedMessagesRecord> => {
  const mockMessages: GeneratedMessagesRecord = {};
  
  personas.forEach((persona, personaIndex) => {
    if (!persona.id) return;
    
    mockMessages[persona.id] = {};
    
    selectedMessageTypes.forEach(type => {
      if (type === "user-provided") {
        mockMessages[persona.id][type] = {
          id: `${persona.id}-${type}`,
          type,
          content: userProvidedMessage || `Default message for ${persona.title || 'this persona'}`
        };
      } else {
        const messageContent = getMessageContentByType(type, persona, personaIndex);
        mockMessages[persona.id][type] = {
          id: `${persona.id}-${type}`,
          type,
          content: messageContent
        };
      }
    });
  });
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return mockMessages;
};

export const generateColumnMessages = async (
  messageType: string,
  personas: Persona[],
  currentMessages: GeneratedMessagesRecord
): Promise<GeneratedMessagesRecord> => {
  if (!personas.length) {
    toast.error("No personas available to generate messages for");
    throw new Error("No personas available");
  }
  
  const updatedMessages = { ...currentMessages };
  
  // Process all personas for this message type
  for (const persona of personas) {
    if (!persona.id) continue;
    
    try {
      const response = await supabase.functions.invoke("generate-taglines", {
        body: { messageType, persona }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      const { tagline } = response.data as { tagline: string };
      
      // Ensure the persona has a messages object
      if (!updatedMessages[persona.id]) {
        updatedMessages[persona.id] = {};
      }
      
      // Update the message for this persona and type
      updatedMessages[persona.id][messageType] = {
        id: `${persona.id}-${messageType}`,
        type: messageType,
        content: tagline
      };
    } catch (error) {
      console.error(`Error generating tagline for persona ${persona.id}:`, error);
      toast.error(`Failed to generate tagline for ${persona.title || 'a persona'}`);
    }
  }
  
  return updatedMessages;
};
