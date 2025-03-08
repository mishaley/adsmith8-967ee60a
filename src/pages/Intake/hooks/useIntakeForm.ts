
import { useOrganizationForm } from "./form/useOrganizationForm";
import { useOfferingForm } from "./form/useOfferingForm";
import { useLocationForm } from "./form/useLocationForm";
import { usePlatformForm } from "./form/usePlatformForm";
import { useMessageForm } from "./form/useMessageForm";
import { usePersonaForm } from "./form/usePersonaForm";

export const useIntakeForm = () => {
  // Organization
  const {
    brandName,
    setBrandName,
    industry,
    setIndustry
  } = useOrganizationForm();
  
  // Offering
  const {
    offering,
    setOffering,
    sellingPoints,
    setSellingPoints,
    problemSolved,
    setProblemSolved,
    uniqueOffering,
    setUniqueOffering
  } = useOfferingForm();
  
  // Location
  const {
    selectedCountry,
    setSelectedCountry,
    selectedLanguage,
    setSelectedLanguage,
    // Multi-select state
    selectedCountries,
    setSelectedCountries,
    selectedLanguages,
    setSelectedLanguages
  } = useLocationForm();
  
  // Ad Platform
  const {
    adPlatform,
    setAdPlatform
  } = usePlatformForm();
  
  // Messages
  const {
    generatedMessages,
    setGeneratedMessages,
    selectedMessageTypes,
    setSelectedMessageTypes
  } = useMessageForm();
  
  // Personas
  const {
    personas,
    setPersonas
  } = usePersonaForm();

  const handleSave = () => {
    // This function could be used for any specific save actions
    console.log("Form data saved");
  };

  // Return all the state and setter functions
  return {
    brandName, setBrandName,
    industry, setIndustry,
    offering, setOffering,
    sellingPoints, setSellingPoints,
    problemSolved, setProblemSolved,
    uniqueOffering, setUniqueOffering,
    selectedCountry, setSelectedCountry,
    adPlatform, setAdPlatform,
    selectedLanguage, setSelectedLanguage,
    // Multi-select state
    selectedCountries, setSelectedCountries,
    selectedLanguages, setSelectedLanguages,
    personas, setPersonas,
    generatedMessages, setGeneratedMessages,
    selectedMessageTypes, setSelectedMessageTypes,
    handleSave
  };
};
