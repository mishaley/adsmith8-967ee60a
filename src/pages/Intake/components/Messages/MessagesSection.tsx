import React, { useEffect, memo } from "react";
import { Persona } from "../Personas/types";
import SimplifiedMessagesTable from "./SimplifiedMessagesTable";
import { useMessagesState } from "./hooks/useMessagesState";
import CollapsibleSection from "../CollapsibleSection";
import SingleSelectField from "../SummaryTable/components/SingleSelectField";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MessagesSectionProps {
  safePersonas: Persona[];
  onUpdateMessages?: (
    generatedMessages: Record<string, Record<string, any>>,
    selectedTypes: string[]
  ) => void;
  isSegmented?: boolean;
  selectedPersonaId;
}

const MessagesSection: React.FC<MessagesSectionProps> = ({
  safePersonas,
  onUpdateMessages,
  isSegmented = true,
  selectedPersonaId,
}) => {
  const {
    selectedMessageTypes,
    userProvidedMessage,
    generatedMessages,
    isTableVisible,
    setGeneratedMessages,
    setIsTableVisible,
    setSelectedMessageTypes,
  } = useMessagesState(safePersonas);

  const { data: messages = [], refetch } = useQuery({
    queryKey: ["messages_names", selectedPersonaId],
    queryFn: async () => {
      if (!selectedPersonaId) return [];
      const { data, error } = await supabase
        .from("d1messages")
        .select("*")
        .eq("persona_id", selectedPersonaId);

      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: Boolean(selectedPersonaId),
  });

  useEffect(() => {
    console.log("Updated selectedPersonaId:", selectedPersonaId);
    if (selectedPersonaId) {
      refetch();
    }
  }, [selectedPersonaId, refetch]);
  const isDisabledMessage =
    !selectedPersonaId || selectedPersonaId === "new-offering";
console.log({messages});

    return (
    <CollapsibleSection title="MESSAGES">
      <div className="bg-transparent">
        <div className="w-72 mx-auto">
          <SingleSelectField
            // options={messages.map((msg) => ({ label: msg.name, value: msg.id }))}
            options={[]}
            value={null}
            onChange={null}
            disabled={isDisabledMessage}
            placeholder="Select Message"
          />
        </div>
        {/* <SimplifiedMessagesTable
          personas={safePersonas}
          selectedMessageTypes={selectedMessageTypes}
          generatedMessages={generatedMessages}
          onMessageTypeChange={(types) => {
            setSelectedMessageTypes(types);
          }}
          isSegmented={isSegmented}
        /> */}
      </div>
    </CollapsibleSection>
  );
};

export default memo(MessagesSection);
