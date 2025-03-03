
import { useState, useEffect } from "react";
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
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

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
      console.log("Generating messages for all personas");
      const mockMessages = await generateMessagesForAllPersonas(
        personas,
        selectedMessageTypes,
        userProvidedMessage
      );
      
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

  const handleGenerateColumnMessages = async (messageType: string) => {
    console.log(`useMessagesGeneration: Generating column messages for type: ${messageType}`);
    setIsGeneratingMessages(true);
    
    try {
      const updatedMessages = await generateColumnMessages(
        messageType,
        personas,
        generatedMessages
      );
      
      console.log("Updated messages:", updatedMessages);
      setGeneratedMessages(updatedMessages);
      setIsTableVisible(true);
      
      return updatedMessages; // Return the result for proper Promise chaining
      
    } catch (error) {
      console.error("Error in generateColumnMessages:", error);
      throw error; // Re-throw to handle in the component
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
