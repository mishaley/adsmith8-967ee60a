
import React from "react";
import { CaptionsSection } from "../Captions";
import { ParametersSection } from "../Parameters";
import { useIntakeForm } from "../../hooks/useIntakeForm";

const ParametersCaptionsContainer: React.FC<any> = () => {
  const { personas = [], generatedMessages = {}, selectedMessageTypes = [], adPlatform = "" } = useIntakeForm();
  
  return (
    <>
      <CaptionsSection 
        personas={personas}
        generatedMessages={generatedMessages}
        selectedMessageTypes={selectedMessageTypes}
        adPlatform={adPlatform}
      />
      <ParametersSection />
    </>
  );
};

export default ParametersCaptionsContainer;
