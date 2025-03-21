
import { useOrganizationForm } from "./form/useOrganizationForm";
import { useOfferingForm } from "./form/useOfferingForm";
import { useLocationForm } from "./form/useLocationForm";
import { usePlatformForm } from "./form/usePlatformForm";
import { useMessageForm } from "./form/useMessageForm";
import { usePersonaForm } from "./form/usePersonaForm";
import { useState } from "react";

export const useIntakeForm = () => {

  const [selectedPersonaId,setSelectedPersonaId]=useState(''); 

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
  
  // Location - only use multi-select API now
  const {
    selectedCountries,
    setSelectedCountries,
    selectedLanguages,
    setSelectedLanguages,
    excludedCountries,
    setExcludedCountries
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
    adPlatform, setAdPlatform,
    // Only return multi-select state
    selectedCountries, setSelectedCountries,
    selectedLanguages, setSelectedLanguages,
    excludedCountries, setExcludedCountries,
    personas, setPersonas,
    generatedMessages, setGeneratedMessages,
    selectedMessageTypes, setSelectedMessageTypes,
    handleSave,
    setSelectedPersonaId,
    selectedPersonaId
  };
};
