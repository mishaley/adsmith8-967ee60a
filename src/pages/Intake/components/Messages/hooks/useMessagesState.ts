import { useState, useEffect } from "react";
import { Persona } from "../../Personas/types";
import { Message } from "./useMessagesFetching";

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
  
  // Initialize empty messages structure when personas or message types change
  useEffect(() => {
    if (personas.length > 0 && selectedMessageTypes.length > 0) {
      // Create an initial empty structure for the messages
      const initialMessages: GeneratedMessagesRecord = {};
      
      personas.forEach((persona, index) => {
        const personaId = persona.id ? String(persona.id) : `persona-${index}`;
        initialMessages[personaId] = {};
        
        selectedMessageTypes.forEach(type => {
          // Only initialize if it doesn't exist yet
          if (!generatedMessages[personaId]?.[type]) {
            initialMessages[personaId][type] = {
              message_id: `${personaId}-${type}-placeholder`,
              message_name: "",
              persona_id: personaId,
              message_type: type,
              created_at: new Date().toISOString(),
            };
          } else {
            // Keep existing messages
            initialMessages[personaId][type] = generatedMessages[personaId][type];
          }
        });
      });
      
      // Only update if there are changes
      if (Object.keys(initialMessages).length > 0) {
        setGeneratedMessages(prevMessages => ({
          ...prevMessages,
          ...initialMessages
        }));
      }
    }
  }, [personas, selectedMessageTypes]);
  
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
