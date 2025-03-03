
import { useState, useCallback } from "react";
import { Persona } from "../../Personas/types";
import { GeneratedMessagesRecord } from "./useMessagesState";
import { generateMessagesForAllPersonas, generateColumnMessages } from "../services/messageGenerationService";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const generateMessages = async () => {
    if (!selectedMessageTypes.length) return;
    
    setIsGeneratingMessages(true);
    try {
      console.log("Generating messages for all personas");
      const mockMessages = await generateMessagesForAllPersonas(
        personas,
        selectedMessageTypes,
        userProvidedMessage
      );
      
      console.log("Generated messages:", mockMessages);
      setGeneratedMessages(mockMessages);
      setIsTableVisible(true);
      
      toast({
        title: "Success",
        description: "Generated messages for all personas"
      });
      
    } catch (error) {
      console.error("Error generating messages:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate messages. Please try again."
      });
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
      
      return updatedMessages;
    } catch (error) {
      console.error("Error in generateColumnMessages:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to generate ${messageType} messages. Please try again.`
      });
      throw error;
    } finally {
      setIsGeneratingMessages(false);
    }
  }, [personas, generatedMessages, setGeneratedMessages, setIsTableVisible, toast]);

  return {
    isGeneratingMessages,
    isLoaded,
    generateMessages,
    handleGenerateColumnMessages
  };
};
