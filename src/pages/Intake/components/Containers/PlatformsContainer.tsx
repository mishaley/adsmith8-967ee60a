
import React from "react";
import PlatformsSection from "../Platforms/PlatformsSection";

interface PlatformsContainerProps {
  adPlatform: string;
  setAdPlatform: (value: string) => void;
}

const PlatformsContainer: React.FC<PlatformsContainerProps> = ({
  adPlatform,
  setAdPlatform
}) => {
  return (
    <PlatformsSection
      adPlatform={adPlatform}
      setAdPlatform={setAdPlatform}
    />
  );
};

export default PlatformsContainer;
