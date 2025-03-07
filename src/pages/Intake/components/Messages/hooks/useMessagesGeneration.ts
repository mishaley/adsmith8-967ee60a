
import { useState, useCallback } from "react";
import { Persona } from "../../Personas/types";
import { GeneratedMessagesRecord } from "./useMessagesState";
import { generateMessagesForAllPersonas, generateColumnMessages } from "../services/messageGenerationService";
import { toast } from "sonner";

export const useMessagesGeneration = (
  personas: Persona[],
  selectedMessageTypes: string[],
  userProvidedMessage: string,
  generatedMessages: GeneratedMessagesRecord,
  setGeneratedMessages: (messages: GeneratedMessagesRecord) => void,
  setIsTableVisible: (visible: boolean) => void
) => {
  const [isGeneratingMessages, setIsGeneratingMessages] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);
  
  // Helper to check if personas array is valid
  const hasValidPersonas = useCallback(() => {
    return Array.isArray(personas) && personas.length > 0 && personas.every(Boolean);
  }, [personas]);

  const generateMessages = async () => {
    if (!selectedMessageTypes.length) {
      toast.error("Please select at least one message type");
      return;
    }
    
    if (!hasValidPersonas()) {
      toast.error("No personas available");
      return;
    }
    
    setIsGeneratingMessages(true);
    try {
      const messages = await generateMessagesForAllPersonas(
        personas,
        selectedMessageTypes,
        userProvidedMessage
      );
      
      // Update the state with the new messages
      setGeneratedMessages(messages);
      setIsTableVisible(true);
      
      // Show sample of generated message
      let sampleMessage = "";
      if (personas.length > 0 && selectedMessageTypes.length > 0) {
        const firstPersonaId = personas[0].id ? String(personas[0].id) : `persona-0`;
        const firstType = selectedMessageTypes[0];
        if (messages[firstPersonaId]?.[firstType]) {
          sampleMessage = messages[firstPersonaId][firstType].message_name;
        }
      }
      
      if (sampleMessage) {
        toast.success(`Generated: "${sampleMessage}"`);
      } else {
        toast.success("Messages generated successfully");
      }
      
    } catch (error) {
      console.error("Error generating messages:", error);
      toast.error("Failed to generate messages. Please try again.");
    } finally {
      setIsGeneratingMessages(false);
    }
  };

  const handleGenerateColumnMessages = useCallback(async (messageType: string) => {
    if (!hasValidPersonas()) {
      toast.error("No personas available");
      throw new Error("No personas available");
    }
    
    setIsGeneratingMessages(true);
    
    try {
      const updatedMessages = await generateColumnMessages(
        messageType,
        personas,
        generatedMessages
      );
      
      // Get the first generated tagline to show in toast (if available)
      let sampleTagline = "";
      if (personas.length > 0 && personas[0]) {
        const firstPersonaId = personas[0].id ? String(personas[0].id) : "persona-0";
        if (updatedMessages[firstPersonaId]?.[messageType]) {
          sampleTagline = updatedMessages[firstPersonaId][messageType].message_name;
        }
      }
      
      // Make sure we're updating the state with the new messages
      setGeneratedMessages(updatedMessages);
      setIsTableVisible(true);
      
      // Show the first generated tagline in the toast (if available)
      if (sampleTagline) {
        toast.success(`Generated: "${sampleTagline}"`);
      } else {
        toast.success(`Generated ${messageType} messages`);
      }
      
    } catch (error) {
      console.error("Error in generateColumnMessages:", error);
      toast.error(`Failed to generate ${messageType} messages. Please try again.`);
      throw error;
    } finally {
      setIsGeneratingMessages(false);
    }
  }, [personas, generatedMessages, setGeneratedMessages, setIsTableVisible, hasValidPersonas]);

  return {
    isGeneratingMessages,
    isLoaded,
    generateMessages,
    handleGenerateColumnMessages
  };
};
