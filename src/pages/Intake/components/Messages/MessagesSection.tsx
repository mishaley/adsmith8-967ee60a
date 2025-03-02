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
const MessagesSection: React.FC<MessagesSectionProps> = ({
  personas
}) => {
  const [selectedPersona, setSelectedPersona] = useState<string>("");
  const [messageType, setMessageType] = useState<string>("pain-point");
  const [isGeneratingMessages, setIsGeneratingMessages] = useState(false);
  const {
    data: messages = [],
    refetch
  } = useQuery({
    queryKey: ["messages", selectedPersona, messageType],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("d1messages").select("*").eq("persona_id", selectedPersona || "none").eq("type", messageType);
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
          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant={messageType === "pain-point" ? "default" : "outline"} size="sm" onClick={() => setMessageType("pain-point")}>
              Pain Point
            </Button>
            <Button variant={messageType === "unique-offering" ? "default" : "outline"} size="sm" onClick={() => setMessageType("unique-offering")}>
              Unique Offering
            </Button>
            <Button variant={messageType === "value-prop" ? "default" : "outline"} size="sm" onClick={() => setMessageType("value-prop")}>
              Value Prop
            </Button>
            <Button variant={messageType === "user-provided" ? "default" : "outline"} size="sm" onClick={() => setMessageType("user-provided")}>
              User Provided
            </Button>
          </div>
          
          <div className="flex items-end gap-4 mb-4">
            <div className="w-64">
              
              <Select value={selectedPersona} onValueChange={setSelectedPersona}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a persona" />
                </SelectTrigger>
                <SelectContent>
                  {personas.map((persona, index) => <SelectItem key={index} value={persona.id || index.toString()}>
                      {persona.name || persona.title}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
          </div>
          
          {selectedPersona && <MessagesList messages={messages} isLoading={isGeneratingMessages} />}
        </td>
      </tr>
    </>;
};
export default MessagesSection;