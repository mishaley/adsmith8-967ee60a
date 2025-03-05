import { useState, useEffect } from "react";
import { STORAGE_KEYS, saveToLocalStorage, loadFromLocalStorage } from "../utils/localStorageUtils";
import { Message } from "../components/Messages/hooks/useMessagesFetching";
import { Persona } from "../components/Personas/types";

export const useIntakeForm = () => {
  // Organization
  const [brandName, setBrandName] = useState(() => loadFromLocalStorage(`${STORAGE_KEYS.ORGANIZATION}_brandName`, ""));
  const [industry, setIndustry] = useState(() => loadFromLocalStorage(`${STORAGE_KEYS.ORGANIZATION}_industry`, ""));
  const [businessDescription, setBusinessDescription] = useState(() => loadFromLocalStorage(`${STORAGE_KEYS.ORGANIZATION}_description`, ""));
  
  // Offering
  const [offering, setOffering] = useState(() => loadFromLocalStorage(`${STORAGE_KEYS.OFFERING}_name`, ""));
  const [sellingPoints, setSellingPoints] = useState(() => loadFromLocalStorage(`${STORAGE_KEYS.OFFERING}_sellingPoints`, ""));
  const [problemSolved, setProblemSolved] = useState(() => loadFromLocalStorage(`${STORAGE_KEYS.OFFERING}_problem`, ""));
  const [uniqueOffering, setUniqueOffering] = useState(() => loadFromLocalStorage(`${STORAGE_KEYS.OFFERING}_unique`, ""));
  
  // Location
  const [selectedCountry, setSelectedCountry] = useState(() => loadFromLocalStorage(`${STORAGE_KEYS.LOCATION}_country`, "US"));
  
  // Ad Platform
  const [adPlatform, setAdPlatform] = useState(() => loadFromLocalStorage(`${STORAGE_KEYS.PLATFORMS}_selected`, "meta"));
  
  // Language
  const [selectedLanguage, setSelectedLanguage] = useState(() => loadFromLocalStorage(`${STORAGE_KEYS.LANGUAGE}_selected`, "en"));
  
  // Add state for personas and messages data for the captions section
  const [personas, setPersonas] = useState<Persona[]>(() => loadFromLocalStorage(`${STORAGE_KEYS.PERSONAS}_data`, []));
  const [generatedMessages, setGeneratedMessages] = useState<Record<string, Record<string, Message>>>(() => 
    loadFromLocalStorage(`${STORAGE_KEYS.MESSAGES}_generated`, {})
  );
  const [selectedMessageTypes, setSelectedMessageTypes] = useState<string[]>(() => 
    loadFromLocalStorage(`${STORAGE_KEYS.MESSAGES}_types`, ["tagline"])
  );

  // Save changes to localStorage
  useEffect(() => {
    saveToLocalStorage(`${STORAGE_KEYS.ORGANIZATION}_brandName`, brandName);
    saveToLocalStorage(`${STORAGE_KEYS.ORGANIZATION}_industry`, industry);
    saveToLocalStorage(`${STORAGE_KEYS.ORGANIZATION}_description`, businessDescription);
    
    saveToLocalStorage(`${STORAGE_KEYS.OFFERING}_name`, offering);
    saveToLocalStorage(`${STORAGE_KEYS.OFFERING}_sellingPoints`, sellingPoints);
    saveToLocalStorage(`${STORAGE_KEYS.OFFERING}_problem`, problemSolved);
    saveToLocalStorage(`${STORAGE_KEYS.OFFERING}_unique`, uniqueOffering);
    
    saveToLocalStorage(`${STORAGE_KEYS.LOCATION}_country`, selectedCountry);
    saveToLocalStorage(`${STORAGE_KEYS.PLATFORMS}_selected`, adPlatform);
    saveToLocalStorage(`${STORAGE_KEYS.LANGUAGE}_selected`, selectedLanguage);
    
    // Save personas and messages state
    saveToLocalStorage(`${STORAGE_KEYS.PERSONAS}_data`, personas);
    saveToLocalStorage(`${STORAGE_KEYS.MESSAGES}_generated`, generatedMessages);
    saveToLocalStorage(`${STORAGE_KEYS.MESSAGES}_types`, selectedMessageTypes);
  }, [
    brandName, industry, businessDescription, 
    offering, sellingPoints, problemSolved, uniqueOffering,
    selectedCountry, adPlatform, selectedLanguage,
    personas, generatedMessages, selectedMessageTypes
  ]);

  const handleSave = () => {
    // This function could be used for any specific save actions
    console.log("Form data saved");
  };

  // Return all the state and setter functions
  return {
    brandName, setBrandName,
    industry, setIndustry,
    businessDescription, setBusinessDescription,
    offering, setOffering,
    sellingPoints, setSellingPoints,
    problemSolved, setProblemSolved,
    uniqueOffering, setUniqueOffering,
    selectedCountry, setSelectedCountry,
    adPlatform, setAdPlatform,
    selectedLanguage, setSelectedLanguage,
    personas, 
    generatedMessages, 
    selectedMessageTypes,
    handleSave
  };
};
