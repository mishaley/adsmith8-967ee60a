
import React from "react";
import OrganizationSection from "../OrganizationSection";

interface OrganizationContainerProps {
  brandName: string;
  setBrandName: (value: string) => void;
  industry: string;
  setIndustry: (value: string) => void;
  businessDescription: string;
  setBusinessDescription: (value: string) => void;
  handleSave: () => void;
}

const OrganizationContainer: React.FC<OrganizationContainerProps> = ({
  brandName,
  setBrandName,
  industry,
  setIndustry,
  businessDescription,
  setBusinessDescription,
  handleSave
}) => {
  // Add debug logging
  console.log("OrganizationContainer rendering with brandName:", brandName);
  
  return (
    <OrganizationSection
      brandName={brandName}
      setBrandName={setBrandName}
      industry={industry}
      setIndustry={setIndustry}
      businessDescription={businessDescription}
      setBusinessDescription={setBusinessDescription}
      handleSave={handleSave}
    />
  );
};

export default OrganizationContainer;
