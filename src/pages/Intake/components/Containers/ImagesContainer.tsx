
import React from "react";
import { Persona } from "../Personas/types";
import { Message } from "../Messages/hooks/useMessagesFetching";
import { ImagesSection } from "../Images";

interface ImagesContainerProps {
  personas: Persona[];
  generatedMessages: Record<string, Record<string, Message>>;
  selectedMessageTypes: string[];
  adPlatform: string;
}

const ImagesContainer: React.FC<ImagesContainerProps> = ({
  personas,
  generatedMessages,
  selectedMessageTypes,
  adPlatform
}) => {
  return (
    <div className="bg-transparent">
      <ImagesSection
        personas={personas}
        generatedMessages={generatedMessages}
        selectedMessageTypes={selectedMessageTypes}
        adPlatform={adPlatform}
      />
    </div>
  );
};

export default ImagesContainer;
