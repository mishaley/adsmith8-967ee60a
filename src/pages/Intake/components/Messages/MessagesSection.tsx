
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Persona } from "../Personas/types";
import MessagesList from "./MessagesList";
import { Input } from "@/components/ui/input";

interface MessagesSectionProps {
  personas: Persona[];
}

const MessagesSection: React.FC<MessagesSectionProps> = ({
  personas
}) => {
  // Change to array for multi-select
  const [selectedMessageTypes, setSelectedMessageTypes] = useState<string[]>([]);
  const [isGeneratingMessages, setIsGeneratingMessages] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userProvidedMessage, setUserProvidedMessage] = useState("");
  
  // Use the first persona ID or empty string if no personas
  const selectedPersonaId = personas.length > 0 && personas[0]?.id ? personas[0].id : "";
  
  // Create a single message type string for the query (comma-separated)
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

  // Set isLoaded to true after initial render
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
    if (!selectedPersonaId || !selectedMessageTypes.length) return;
    setIsGeneratingMessages(true);
    try {
      // In a real implementation, you would call an API to generate messages
      // For now, let's simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      await refetch();
    } catch (error) {
      console.error("Error generating messages:", error);
    } finally {
      setIsGeneratingMessages(false);
    }
  };

  const isUserProvidedSelected = selectedMessageTypes.includes("user-provided");

  return <>
      <tr className="border-b">
        <td colSpan={2} className="py-4 text-lg">
          <div className="w-full text-left pl-4 flex items-center">
            <span>Messages</span>
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan={2} className="p-4">
          <div className="flex flex-wrap gap-2 mb-4 items-center">
            <Button 
              variant={selectedMessageTypes.includes("pain-point") ? "default" : "outline"} 
              size="sm" 
              onClick={() => toggleMessageType("pain-point")}
              className={`transition-all duration-300 ${!isLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isLoaded}
            >
              Pain Point
            </Button>
            <Button 
              variant={selectedMessageTypes.includes("unique-offering") ? "default" : "outline"} 
              size="sm" 
              onClick={() => toggleMessageType("unique-offering")}
              className={`transition-all duration-300 ${!isLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isLoaded}
            >
              Unique Offering
            </Button>
            <Button 
              variant={selectedMessageTypes.includes("value-prop") ? "default" : "outline"} 
              size="sm" 
              onClick={() => toggleMessageType("value-prop")}
              className={`transition-all duration-300 ${!isLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isLoaded}
            >
              Value Prop
            </Button>
            <Button 
              variant={selectedMessageTypes.includes("user-provided") ? "default" : "outline"} 
              size="sm" 
              onClick={() => toggleMessageType("user-provided")}
              className={`transition-all duration-300 ${!isLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isLoaded}
            >
              User Provided
            </Button>
            
            {isUserProvidedSelected && (
              <div className="flex-grow max-w-md">
                <Input
                  type="text"
                  placeholder="Enter your custom message here..."
                  value={userProvidedMessage}
                  onChange={(e) => setUserProvidedMessage(e.target.value)}
                  className="w-full"
                />
              </div>
            )}
          </div>
          
          {selectedPersonaId && <MessagesList messages={messages} isLoading={isGeneratingMessages || isLoading} />}
        </td>
      </tr>
    </>;
};

export default MessagesSection;
