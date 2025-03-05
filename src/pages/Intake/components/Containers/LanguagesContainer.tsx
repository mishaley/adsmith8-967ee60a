
import React from "react";
import LanguagesSection from "../Languages/LanguagesSection";

interface LanguagesContainerProps {
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
}

const LanguagesContainer: React.FC<LanguagesContainerProps> = ({
  selectedLanguage,
  setSelectedLanguage
}) => {
  return (
    <LanguagesSection
      selectedLanguage={selectedLanguage}
      setSelectedLanguage={setSelectedLanguage}
    />
  );
};

export default LanguagesContainer;
