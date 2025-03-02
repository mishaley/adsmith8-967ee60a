
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Persona } from "../Personas/types";
import MessagesList from "./MessagesList";
import MessageTypeSelector from "./MessageTypeSelector";
import UserProvidedInput from "./UserProvidedInput";
import GenerateButton from "./GenerateButton";
import MessagesTable from "./MessagesTable";
import { getMessageContentByType, getMessageTypeLabel } from "./messageUtils";
import { toast } from "sonner";

interface MessagesSectionProps {
  personas: Persona[];
}

// Define the Message type separately to avoid deep nesting
interface Message {
  id: string;
  type: string;
  content: string;
}

// Use a simpler type for the generated messages record
type GeneratedMessagesRecord = Record<string, Record<string, Message>>;

const MessagesSection: React.FC<MessagesSectionProps> = ({ personas }) => {
  const [selectedMessageTypes, setSelectedMessageTypes] = useState<string[]>([]);
  const [isGeneratingMessages, setIsGeneratingMessages] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userProvidedMessage, setUserProvidedMessage] = useState("");
  const [generatedMessages, setGeneratedMessages] = useState<GeneratedMessagesRecord>({});
  const [isTableVisible, setIsTableVisible] = useState(false);
  
  const selectedPersonaId = personas.length > 0 && personas[0]?.id ? personas[0].id : "";
  
  const messageTypeString = selectedMessageTypes.join(',');
  
  const {
    data: messages = [],
    refetch,
    isLoading
  } = useQuery({
    queryKey: ["messages", selectedPersonaId, messageTypeString],
    queryFn: async () => {
      if (!selectedMessageTypes.length) return [];
      
      const { data } = await supabase
        .from("d1messages")
        .select("*")
        .eq("persona_id", selectedPersonaId || "none")
        .in("type", selectedMessageTypes);
      
      return data || [];
    },
    enabled: !!selectedPersonaId && selectedMessageTypes.length > 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleMessageType = (type: string) => {
    setSelectedMessageTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const generateMessages = async () => {
    if (!selectedMessageTypes.length) return;
    
    setIsGeneratingMessages(true);
    try {
      const mockMessages: Record<string, Record<string, Message>> = {};
      
      personas.forEach((persona, personaIndex) => {
        if (!persona.id) return;
        
        mockMessages[persona.id] = {};
        
        selectedMessageTypes.forEach(type => {
          if (type === "user-provided") {
            mockMessages[persona.id][type] = {
              id: `${persona.id}-${type}`,
              type,
              content: userProvidedMessage || `Default message for ${persona.title || 'this persona'}`
            };
          } else {
            const messageContent = getMessageContentByType(type, persona, personaIndex);
            mockMessages[persona.id][type] = {
              id: `${persona.id}-${type}`,
              type,
              content: messageContent
            };
          }
        });
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setGeneratedMessages(mockMessages);
      setIsTableVisible(true);
      
      await refetch();
    } catch (error) {
      console.error("Error generating messages:", error);
    } finally {
      setIsGeneratingMessages(false);
    }
  };

  const generateColumnMessages = async (messageType: string) => {
    if (!personas.length) {
      toast.error("No personas available to generate messages for");
      return;
    }

    setIsGeneratingMessages(true);
    
    try {
      const updatedMessages = { ...generatedMessages };
      
      // Process all personas for this message type
      for (const persona of personas) {
        if (!persona.id) continue;
        
        try {
          const response = await supabase.functions.invoke("generate-taglines", {
            body: { messageType, persona }
          });
          
          if (response.error) {
            throw new Error(response.error.message);
          }
          
          const { tagline } = response.data as { tagline: string };
          
          // Ensure the persona has a messages object
          if (!updatedMessages[persona.id]) {
            updatedMessages[persona.id] = {};
          }
          
          // Update the message for this persona and type
          updatedMessages[persona.id][messageType] = {
            id: `${persona.id}-${messageType}`,
            type: messageType,
            content: tagline
          };
        } catch (error) {
          console.error(`Error generating tagline for persona ${persona.id}:`, error);
          toast.error(`Failed to generate tagline for ${persona.title || 'a persona'}`);
        }
      }
      
      setGeneratedMessages(updatedMessages);
      setIsTableVisible(true);
      
    } catch (error) {
      console.error("Error in generateColumnMessages:", error);
      toast.error("Failed to generate messages. Please try again.");
    } finally {
      setIsGeneratingMessages(false);
    }
  };

  const isUserProvidedSelected = selectedMessageTypes.includes("user-provided");

  return (
    <>
      <tr className="border-b">
        <td colSpan={2} className="py-4 text-lg">
          <div className="w-full text-left pl-4 flex items-center">
            <span>Messages</span>
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan={2} className="p-4">
          <div className="flex flex-wrap mb-4 items-start">
            <MessageTypeSelector 
              selectedMessageTypes={selectedMessageTypes}
              toggleMessageType={toggleMessageType}
              isLoaded={isLoaded}
            />
            
            <UserProvidedInput
              userProvidedMessage={userProvidedMessage}
              setUserProvidedMessage={setUserProvidedMessage}
              isUserProvidedSelected={isUserProvidedSelected}
            />
          </div>
          
          <div className="mb-4">
            <GenerateButton
              isGeneratingMessages={isGeneratingMessages}
              selectedMessageTypes={selectedMessageTypes}
              isLoaded={isLoaded}
              generateMessages={generateMessages}
            />
          </div>
          
          <MessagesTable
            isTableVisible={isTableVisible}
            personas={personas}
            selectedMessageTypes={selectedMessageTypes}
            generatedMessages={generatedMessages}
            isGeneratingMessages={isGeneratingMessages}
            getMessageTypeLabel={getMessageTypeLabel}
            onGenerateColumnMessages={generateColumnMessages}
          />
          
          {selectedPersonaId && !isTableVisible && (
            <MessagesList messages={messages} isLoading={isGeneratingMessages || isLoading} />
          )}
        </td>
      </tr>
    </>
  );
};

export default MessagesSection;
