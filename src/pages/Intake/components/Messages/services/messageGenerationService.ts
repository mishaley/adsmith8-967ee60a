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
    console.log(`Generating tagline for ${messageType} and persona:`, persona.name || 'Unknown');
    
    const { data, error } = await supabase.functions.invoke('generate-marketing-taglines', {
      body: { 
        messageType,
        persona: {
          name: persona.name || 'Unknown',
          age: `${persona.ageMin}-${persona.ageMax}`,
          gender: persona.gender,
          description: `Interests: ${persona.interests.join(', ')}` 
        }
      }
    });

    if (error) {
      console.error('Error calling generate-marketing-taglines:', error);
      throw error;
    }

    console.log('AI tagline generated:', data.tagline);
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
  console.log(`Generating message for type: ${messageType}, personaId: ${personaId}`);
  
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
  console.log(`Generating column messages for type: ${messageType}, personas count: ${personas.length}`);
  const updatedMessages = { ...existingMessages };

  for (const persona of personas) {
    if (persona.id) {
      console.log(`Generating message for persona: ${persona.id}`);
      const message = await generateMessageForType(messageType, persona.id, "", persona);
      
      // Initialize persona entry if it doesn't exist
      if (!updatedMessages[persona.id]) {
        updatedMessages[persona.id] = {};
      }
      
      // Add the generated message
      updatedMessages[persona.id][messageType] = message;
      console.log(`Generated message for persona ${persona.id}: ${message.message_name}`);
    }
  }

  return updatedMessages;
}
