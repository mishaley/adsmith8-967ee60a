
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Persona } from "../Personas/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MessagesList from "./MessagesList";

interface MessagesSectionProps {
  personas: Persona[];
}

const MessagesSection: React.FC<MessagesSectionProps> = ({ personas }) => {
  const [selectedPersona, setSelectedPersona] = useState<string>("");
  const [isGeneratingMessages, setIsGeneratingMessages] = useState(false);
  
  const { data: messages = [], refetch } = useQuery({
    queryKey: ["messages", selectedPersona],
    queryFn: async () => {
      const { data } = await supabase
        .from("d1messages")
        .select("*")
        .eq("persona_id", selectedPersona || "none");
      
      return data || [];
    },
    enabled: !!selectedPersona
  });

  const generateMessages = async () => {
    if (!selectedPersona) return;
    
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
          <div className="flex items-end gap-4 mb-4">
            <div className="w-64">
              <label className="block text-sm font-medium mb-1">Select Persona</label>
              <Select
                value={selectedPersona}
                onValueChange={setSelectedPersona}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a persona" />
                </SelectTrigger>
                <SelectContent>
                  {personas.map((persona, index) => (
                    <SelectItem 
                      key={index} 
                      value={persona.id || index.toString()}
                    >
                      {persona.name || persona.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={generateMessages} 
              disabled={isGeneratingMessages || !selectedPersona}
              size="sm"
            >
              {isGeneratingMessages ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Generating Messages...
                </>
              ) : (
                "Generate Messages"
              )}
            </Button>
          </div>
          
          {selectedPersona && (
            <MessagesList 
              messages={messages} 
              isLoading={isGeneratingMessages} 
            />
          )}
        </td>
      </tr>
    </>
  );
};

export default MessagesSection;
