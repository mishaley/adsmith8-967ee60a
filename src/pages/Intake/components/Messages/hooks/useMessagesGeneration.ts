
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

  const generateMessages = async () => {
    if (!selectedMessageTypes.length) return;
    
    setIsGeneratingMessages(true);
    try {
      console.log("Generating messages for all personas");
      const generatedMessages = await generateMessagesForAllPersonas(
        personas,
        selectedMessageTypes,
        userProvidedMessage
      );
      
      console.log("Generated messages:", generatedMessages);
      // Make sure we're setting the state with the new messages
      setGeneratedMessages(generatedMessages);
      setIsTableVisible(true);
      
      toast.success("Generated messages for all personas");
      
    } catch (error) {
      console.error("Error generating messages:", error);
      toast.error("Failed to generate messages. Please try again.");
    } finally {
      setIsGeneratingMessages(false);
    }
  };

  const handleGenerateColumnMessages = useCallback(async (messageType: string): Promise<GeneratedMessagesRecord> => {
    console.log(`useMessagesGeneration: Generating column messages for type: ${messageType}`);
    setIsGeneratingMessages(true);
    
    try {
      const updatedMessages = await generateColumnMessages(
        messageType,
        personas,
        generatedMessages
      );
      
      console.log("Messages generated successfully:", updatedMessages);
      
      // Update the state with the new messages
      setGeneratedMessages(updatedMessages);
      setIsTableVisible(true);
      
      toast.success(`Generated messages for ${messageType}`);
      
      return updatedMessages;
    } catch (error) {
      console.error("Error in generateColumnMessages:", error);
      toast.error(`Failed to generate ${messageType} messages. Please try again.`);
      throw error;
    } finally {
      setIsGeneratingMessages(false);
    }
  }, [personas, generatedMessages, setGeneratedMessages, setIsTableVisible]);

  return {
    isGeneratingMessages,
    isLoaded,
    generateMessages,
    handleGenerateColumnMessages
  };
};
