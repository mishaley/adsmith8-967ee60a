
import React from "react";
import { CaptionsSection } from "../Captions";
import { ParametersSection } from "../Parameters";
import { useIntakeForm } from "../../hooks/useIntakeForm";
import { Persona } from "../Personas/types";
import { Message } from "../Messages/hooks/useMessagesFetching";

interface ParametersCaptionsContainerProps {
  personas: Persona[];
  generatedMessages: Record<string, Record<string, Message>>;
  selectedMessageTypes: string[];
  adPlatform: string;
}

const ParametersCaptionsContainer: React.FC<ParametersCaptionsContainerProps> = ({
  personas,
  generatedMessages,
  selectedMessageTypes,
  adPlatform
}) => {
  return (
    <>
      <CaptionsSection 
        personas={personas}
        generatedMessages={generatedMessages}
        selectedMessageTypes={selectedMessageTypes}
        adPlatform={adPlatform}
      />
    </>
  );
};

export default ParametersCaptionsContainer;
