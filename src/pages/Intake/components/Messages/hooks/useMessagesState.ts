
import { useState } from "react";
import { Persona } from "../../Personas/types";

// Define the Message type to avoid deep nesting
export interface Message {
  id: string;
  type: string;
  content: string;
}

// Use a simpler type for the generated messages record
export type GeneratedMessagesRecord = Record<string, Record<string, Message>>;

export const useMessagesState = (personas: Persona[]) => {
  const [selectedMessageTypes, setSelectedMessageTypes] = useState<string[]>([]);
  const [isGeneratingMessages, setIsGeneratingMessages] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true); // Initialize to true so buttons are enabled by default
  const [userProvidedMessage, setUserProvidedMessage] = useState("");
  const [generatedMessages, setGeneratedMessages] = useState<GeneratedMessagesRecord>({});
  const [isTableVisible, setIsTableVisible] = useState(false);
  
  const selectedPersonaId = personas.length > 0 && personas[0]?.id ? personas[0].id : "";
  
  const toggleMessageType = (type: string) => {
    setSelectedMessageTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  return {
    selectedMessageTypes,
    setSelectedMessageTypes,
    isGeneratingMessages,
    setIsGeneratingMessages,
    isLoaded,
    setIsLoaded,
    userProvidedMessage,
    setUserProvidedMessage,
    generatedMessages,
    setGeneratedMessages,
    isTableVisible,
    setIsTableVisible,
    selectedPersonaId,
    toggleMessageType
  };
};
