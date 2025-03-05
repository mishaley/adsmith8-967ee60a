
import { useState, useEffect } from "react";
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from "../utils/localStorageUtils";

export const useIntakeForm = () => {
  // Load initial values from localStorage or use empty strings as defaults
  const [brandName, setBrandName] = useState(() => 
    loadFromLocalStorage<string>(STORAGE_KEYS.ORGANIZATION + "_brandName", ""));
  
  const [industry, setIndustry] = useState(() => 
    loadFromLocalStorage<string>(STORAGE_KEYS.ORGANIZATION + "_industry", ""));
  
  const [businessDescription, setBusinessDescription] = useState(() => 
    loadFromLocalStorage<string>(STORAGE_KEYS.ORGANIZATION + "_businessDescription", ""));
  
  const [offering, setOffering] = useState(() => 
    loadFromLocalStorage<string>(STORAGE_KEYS.OFFERING + "_offering", ""));
  
  const [sellingPoints, setSellingPoints] = useState(() => 
    loadFromLocalStorage<string>(STORAGE_KEYS.OFFERING + "_sellingPoints", ""));
  
  const [problemSolved, setProblemSolved] = useState(() => 
    loadFromLocalStorage<string>(STORAGE_KEYS.OFFERING + "_problemSolved", ""));
  
  const [uniqueOffering, setUniqueOffering] = useState(() => 
    loadFromLocalStorage<string>(STORAGE_KEYS.OFFERING + "_uniqueOffering", ""));
  
  const [adPlatform, setAdPlatform] = useState(() => 
    loadFromLocalStorage<string>(STORAGE_KEYS.PLATFORMS + "_platform", ""));
  
  const [selectedCountry, setSelectedCountry] = useState(() => 
    loadFromLocalStorage<string>(STORAGE_KEYS.LOCATION + "_country", ""));
  
  const [selectedLanguage, setSelectedLanguage] = useState(() => 
    loadFromLocalStorage<string>(STORAGE_KEYS.LANGUAGE + "_language", "English"));

  // Update localStorage whenever state changes
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.ORGANIZATION + "_brandName", brandName);
  }, [brandName]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.ORGANIZATION + "_industry", industry);
  }, [industry]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.ORGANIZATION + "_businessDescription", businessDescription);
  }, [businessDescription]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.OFFERING + "_offering", offering);
  }, [offering]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.OFFERING + "_sellingPoints", sellingPoints);
  }, [sellingPoints]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.OFFERING + "_problemSolved", problemSolved);
  }, [problemSolved]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.OFFERING + "_uniqueOffering", uniqueOffering);
  }, [uniqueOffering]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.PLATFORMS + "_platform", adPlatform);
  }, [adPlatform]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.LOCATION + "_country", selectedCountry);
  }, [selectedCountry]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.LANGUAGE + "_language", selectedLanguage);
  }, [selectedLanguage]);

  const handleSave = () => {
    console.log("Saving form data:", {
      brandName,
      industry,
      businessDescription,
      offering,
      sellingPoints,
      problemSolved,
      uniqueOffering,
      adPlatform,
      selectedCountry,
      selectedLanguage
    });
    // Here you would typically save the data to a database
  };

  return {
    brandName,
    setBrandName,
    industry,
    setIndustry,
    businessDescription,
    setBusinessDescription,
    offering,
    setOffering,
    sellingPoints,
    setSellingPoints,
    problemSolved,
    setProblemSolved,
    uniqueOffering,
    setUniqueOffering,
    adPlatform,
    setAdPlatform,
    selectedCountry,
    setSelectedCountry,
    selectedLanguage,
    setSelectedLanguage,
    handleSave
  };
};
