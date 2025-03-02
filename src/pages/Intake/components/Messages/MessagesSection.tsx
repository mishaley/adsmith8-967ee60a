
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

interface Message {
  id: string;
  type: string;
  content: string;
}

const MessagesSection: React.FC<MessagesSectionProps> = ({
  personas
}) => {
  // Change to array for multi-select
  const [selectedMessageTypes, setSelectedMessageTypes] = useState<string[]>([]);
  const [isGeneratingMessages, setIsGeneratingMessages] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userProvidedMessage, setUserProvidedMessage] = useState("");
  const [generatedMessages, setGeneratedMessages] = useState<Record<string, Record<string, Message>>>({});
  const [isTableVisible, setIsTableVisible] = useState(false);
  
  // Use the first persona ID or empty string if no personas
  const selectedPersonaId = personas.length > 0 && personas[0]?.id ? personas[0].id : "";
  
  // Fix for "Type instantiation is excessively deep and possibly infinite" error:
  // Create a derived messageTypes value that doesn't change on every render
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
    if (!selectedMessageTypes.length) return;
    
    setIsGeneratingMessages(true);
    try {
      // In a real implementation, you would call an API to generate messages
      // For now, let's create mock data for each persona and message type
      const mockMessages: Record<string, Record<string, Message>> = {};
      
      personas.forEach((persona, personaIndex) => {
        if (!persona.id) return;
        
        mockMessages[persona.id] = {};
        
        selectedMessageTypes.forEach(type => {
          // For user-provided type, use the message entered by the user
          if (type === "user-provided") {
            mockMessages[persona.id][type] = {
              id: `${persona.id}-${type}`,
              type,
              content: userProvidedMessage || `Default message for ${persona.title || 'this persona'}`
            };
          } else {
            // Generate mock content for other message types
            const messageContent = getMessageContentByType(type, persona, personaIndex);
            mockMessages[persona.id][type] = {
              id: `${persona.id}-${type}`,
              type,
              content: messageContent
            };
          }
        });
      });
      
      // Simulate API delay
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

  // Helper function to get mock message content based on type and persona
  const getMessageContentByType = (type: string, persona: Persona, index: number): string => {
    const personaName = persona.title || `Persona ${index + 1}`;
    
    switch (type) {
      case "pain-point":
        return `${personaName} is frustrated with traditional solutions that are ${persona.gender === 'Men' ? 'time-consuming' : 'complicated'} and expensive.`;
      case "unique-offering":
        return `Our solution offers ${personaName} a streamlined experience with intuitive controls and affordable pricing.`;
      case "value-prop":
        return `${personaName} will save 30% more time and money while achieving better results with our innovative approach.`;
      default:
        return `Message for ${personaName} with type: ${type}`;
    }
  };

  const isUserProvidedSelected = selectedMessageTypes.includes("user-provided");

  const getMessageTypeLabel = (type: string): string => {
    switch (type) {
      case "pain-point": return "Pain Point";
      case "unique-offering": return "Unique Offering";
      case "value-prop": return "Value Prop";
      case "user-provided": return "User Provided";
      default: return type;
    }
  };

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
          
          <div className="mb-4">
            <Button 
              onClick={generateMessages} 
              disabled={isGeneratingMessages || selectedMessageTypes.length === 0 || !isLoaded}
              className={`transition-all duration-300 ${!isLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isGeneratingMessages ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : "Generate"}
            </Button>
          </div>
          
          {isTableVisible && personas.length > 0 && selectedMessageTypes.length > 0 && (
            <div className="mt-6 border rounded overflow-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Persona</th>
                    {selectedMessageTypes.map(type => (
                      <th key={type} className="border p-2 text-left">
                        {getMessageTypeLabel(type)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {personas.map((persona, index) => (
                    <tr key={persona.id || index} className="border-t">
                      <td className="border p-2 align-top">
                        <div className="flex items-center">
                          {persona.portraitUrl ? (
                            <img 
                              src={persona.portraitUrl} 
                              alt={`Portrait of ${persona.title || `Persona ${index + 1}`}`}
                              className="w-16 h-16 rounded-md object-cover mr-2"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center mr-2">
                              <span className="text-xs text-gray-500">No image</span>
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{persona.title || `Persona ${index + 1}`}</div>
                            <div className="text-sm text-gray-500">
                              {persona.gender}, {persona.ageMin}-{persona.ageMax}
                            </div>
                          </div>
                        </div>
                      </td>
                      {selectedMessageTypes.map(type => (
                        <td key={`${persona.id}-${type}`} className="border p-2 align-top">
                          {isGeneratingMessages ? (
                            <div className="flex items-center justify-center h-16">
                              <Loader className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            <div>
                              {persona.id && generatedMessages[persona.id]?.[type] ? (
                                <p>{generatedMessages[persona.id][type].content}</p>
                              ) : (
                                <p className="text-gray-400">No message generated</p>
                              )}
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {selectedPersonaId && !isTableVisible && <MessagesList messages={messages} isLoading={isGeneratingMessages || isLoading} />}
        </td>
      </tr>
    </>;
};

export default MessagesSection;
