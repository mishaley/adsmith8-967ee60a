
import React from "react";
import LanguagesSection from "../Languages/LanguagesSection";

interface LanguagesContainerProps {
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
  selectedCountry: string;
}

const LanguagesContainer: React.FC<LanguagesContainerProps> = ({
  selectedLanguage,
  setSelectedLanguage,
  selectedCountry
}) => {
  return (
    <LanguagesSection
      selectedLanguage={selectedLanguage}
      setSelectedLanguage={setSelectedLanguage}
      selectedCountry={selectedCountry}
    />
  );
};

export default LanguagesContainer;
