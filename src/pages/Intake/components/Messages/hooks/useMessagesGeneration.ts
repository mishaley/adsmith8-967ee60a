
import { useState, useEffect } from "react";
import { Persona } from "../../Personas/types";
import { GeneratedMessagesRecord } from "./useMessagesState";
import { generateMessagesForAllPersonas, generateColumnMessages } from "../services/messageGenerationService";

export const useMessagesGeneration = (
  personas: Persona[],
  selectedMessageTypes: string[],
  userProvidedMessage: string,
  generatedMessages: GeneratedMessagesRecord,
  setGeneratedMessages: (messages: GeneratedMessagesRecord) => void,
  setIsTableVisible: (visible: boolean) => void
) => {
  const [isGeneratingMessages, setIsGeneratingMessages] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Set isLoaded after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const generateMessages = async () => {
    if (!selectedMessageTypes.length) return;
    
    setIsGeneratingMessages(true);
    try {
      const mockMessages = await generateMessagesForAllPersonas(
        personas,
        selectedMessageTypes,
        userProvidedMessage
      );
      
      setGeneratedMessages(mockMessages);
      setIsTableVisible(true);
      
    } catch (error) {
      console.error("Error generating messages:", error);
    } finally {
      setIsGeneratingMessages(false);
    }
  };

  const handleGenerateColumnMessages = async (messageType: string) => {
    setIsGeneratingMessages(true);
    
    try {
      const updatedMessages = await generateColumnMessages(
        messageType,
        personas,
        generatedMessages
      );
      
      setGeneratedMessages(updatedMessages);
      setIsTableVisible(true);
      
    } catch (error) {
      console.error("Error in generateColumnMessages:", error);
    } finally {
      setIsGeneratingMessages(false);
    }
  };

  return {
    isGeneratingMessages,
    isLoaded,
    generateMessages,
    handleGenerateColumnMessages
  };
};
