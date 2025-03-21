import { useState, useEffect } from "react";
import { Persona } from "../../Personas/types";
import { Message } from "./useMessagesFetching";
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from "../../../utils/localStorage";

// Use a simpler type for the generated messages record
export type GeneratedMessagesRecord = Record<string, Record<string, Message>>;

export const useMessagesState = (personas: Persona[]) => {
  // Load initial values from localStorage
  const [selectedMessageTypes, setSelectedMessageTypes] = useState<string[]>(() => 
    loadFromLocalStorage<string[]>(STORAGE_KEYS.MESSAGES + "_types", []));
    
  const [isGeneratingMessages, setIsGeneratingMessages] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);
  
  const [userProvidedMessage, setUserProvidedMessage] = useState<string>(() => 
    loadFromLocalStorage<string>(STORAGE_KEYS.MESSAGES + "_userProvided", ""));
    
  const [generatedMessages, setGeneratedMessages] = useState<GeneratedMessagesRecord>(() => 
    loadFromLocalStorage<GeneratedMessagesRecord>(STORAGE_KEYS.MESSAGES + "_generated", {}));
    
  const [isTableVisible, setIsTableVisible] = useState<boolean>(() => 
    loadFromLocalStorage<boolean>(STORAGE_KEYS.MESSAGES + "_tableVisible", false));
  
  // Safely get the first valid persona ID with null checks
  const selectedPersonaId = personas && personas.length > 0 && personas[0] ? 
    (personas[0].id ? personas[0].id.toString() : `persona-0`) : "";
  
  // Save to localStorage when values change
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.MESSAGES + "_types", selectedMessageTypes);
  }, [selectedMessageTypes]);
  
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.MESSAGES + "_userProvided", userProvidedMessage);
  }, [userProvidedMessage]);
  
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.MESSAGES + "_generated", generatedMessages);
  }, [generatedMessages]);
  
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.MESSAGES + "_tableVisible", isTableVisible);
  }, [isTableVisible]);
  
  // Initialize empty messages structure when personas or message types change
  useEffect(() => {
    if (personas.length > 0 && selectedMessageTypes.length > 0) {
      // Create an initial empty structure for the messages
      const initialMessages: GeneratedMessagesRecord = {};
      
      personas.forEach((persona, index) => {
        // Add null check for persona
        if (!persona) return;
        
        const personaId = persona.id ? String(persona.id) : `persona-${index}`;
        initialMessages[personaId] = {};
        
        selectedMessageTypes.forEach(type => {
          // Only initialize if it doesn't exist yet
          if (!generatedMessages[personaId]?.[type]) {
            initialMessages[personaId][type] = {
              id: `${personaId}-${type}-placeholder`,
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
  }, [selectedMessageTypes]);
  
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
