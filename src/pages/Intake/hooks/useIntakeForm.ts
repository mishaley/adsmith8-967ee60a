
import { useState } from "react";

export const useIntakeForm = () => {
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [offering, setOffering] = useState("");
  const [sellingPoints, setSellingPoints] = useState("");
  const [problemSolved, setProblemSolved] = useState(""); 
  const [uniqueOffering, setUniqueOffering] = useState("");
  const [adPlatform, setAdPlatform] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

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
      selectedCountry
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
    handleSave
  };
};
