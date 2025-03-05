
import React from "react";
import { CaptionsSection } from "../Captions";
import { ParametersSection } from "../Parameters";

// The component doesn't need to receive any props, but we need to explicitly accept and ignore them
// to prevent the TypeScript error
interface ParametersCaptionsContainerProps {
  // This empty interface allows any props to be passed to the component
  [key: string]: any;
}

const ParametersCaptionsContainer: React.FC<ParametersCaptionsContainerProps> = () => {
  return (
    <>
      <CaptionsSection />
      <ParametersSection />
    </>
  );
};

export default ParametersCaptionsContainer;
