
import { v4 as uuidv4 } from 'uuid';
import { Persona } from '../../Personas/types';
import { GeneratedMessagesRecord } from '../hooks/useMessagesState';
import { Message } from '../hooks/useMessagesFetching';
import { supabase } from "@/integrations/supabase/client";

// Mock data for testing (fallback if AI generation fails)
const mockMessages = {
  "pain-point": [
    "They struggle finding reliable service providers who actually show up on time.",
    "Their energy bills are consistently higher than they think they should be.",
    "They worry about the security of their home when they're traveling."
  ],
  "unique-offering": [
    "Our technicians arrive within the scheduled hour or we discount the service by 20%.",
    "Our smart home solutions reduce energy consumption by an average of 27%.",
    "Our security systems include 24/7 monitoring with a 45-second response time."
  ],
  "value-prop": [
    "Save time and frustration with service providers who respect your schedule.",
    "Reduce your monthly expenses while making your home more comfortable.",
    "Enjoy peace of mind knowing your home is protected by cutting-edge technology."
  ]
};

// AI-powered tagline generation
async function generateTaglineWithAI(messageType: string, persona: Persona): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-marketing-taglines', {
      body: { 
        messageType,
        persona: {
          name: persona.persona_name,
          age: persona.persona_age || 'unknown',
          gender: persona.persona_gender || 'unknown',
          description: persona.persona_description || ''
        }
      }
    });

    if (error) {
      console.error('Error calling generate-marketing-taglines:', error);
      throw error;
    }

    return data.tagline;
  } catch (error) {
    console.error('Error generating tagline with AI:', error);
    // Fall back to mock messages if AI generation fails
    const messages = mockMessages[messageType as keyof typeof mockMessages] || [];
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex] || "No message available";
  }
}

export async function generateMessageForType(
  messageType: string,
  personaId: string,
  userProvidedMessage: string = "",
  persona?: Persona
): Promise<Message> {
  // For user-provided message type, just use what the user entered
  if (messageType === "user-provided" && userProvidedMessage) {
    return {
      message_id: uuidv4(),
      message_name: userProvidedMessage,
      message_type: messageType,
      message_url: userProvidedMessage,
      message_status: "generated"
    };
  }

  // For other types, use AI generation if persona is provided, otherwise use mock data
  let messageContent;
  
  if (persona) {
    messageContent = await generateTaglineWithAI(messageType, persona);
  } else {
    // Fallback to mock data
    const messages = mockMessages[messageType as keyof typeof mockMessages] || [];
    const randomIndex = Math.floor(Math.random() * messages.length);
    messageContent = messages[randomIndex] || "No message available";
  }

  return {
    message_id: uuidv4(),
    message_name: messageContent,
    message_type: messageType,
    message_url: messageContent,
    message_status: "generated"
  };
}

export async function generateMessagesForPersona(
  persona: Persona,
  messageTypes: string[],
  userProvidedMessage: string = ""
): Promise<Record<string, Message>> {
  const personaMessages: Record<string, Message> = {};

  // Generate a message for each message type
  for (const type of messageTypes) {
    const message = await generateMessageForType(type, persona.id || "unknown", userProvidedMessage, persona);
    personaMessages[type] = message;
  }

  return personaMessages;
}

export async function generateMessagesForAllPersonas(
  personas: Persona[],
  messageTypes: string[],
  userProvidedMessage: string = ""
): Promise<GeneratedMessagesRecord> {
  const allMessages: GeneratedMessagesRecord = {};

  // Generate messages for each persona
  for (const persona of personas) {
    if (persona.id) {
      const personaMessages = await generateMessagesForPersona(
        persona,
        messageTypes,
        userProvidedMessage
      );
      allMessages[persona.id] = personaMessages;
    }
  }

  return allMessages;
}

export async function generateColumnMessages(
  messageType: string, 
  personas: Persona[],
  existingMessages: GeneratedMessagesRecord
): Promise<GeneratedMessagesRecord> {
  const updatedMessages = { ...existingMessages };

  for (const persona of personas) {
    if (persona.id) {
      const message = await generateMessageForType(messageType, persona.id, "", persona);
      
      // Initialize persona entry if it doesn't exist
      if (!updatedMessages[persona.id]) {
        updatedMessages[persona.id] = {};
      }
      
      // Add the generated message
      updatedMessages[persona.id][messageType] = message;
    }
  }

  return updatedMessages;
}
