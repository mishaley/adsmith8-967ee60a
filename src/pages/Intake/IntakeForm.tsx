
import React from "react";
import QuadrantLayout from "@/components/QuadrantLayout";
import IntakeFormContainer from "./components/IntakeFormContainer";
import IntakeTop from "./components/IntakeTop";
import { useIntakeForm } from "./hooks/useIntakeForm";
import { usePersonasManager } from "./hooks/personas/usePersonasManager";
import OrganizationSection from "./components/OrganizationSection";

const IntakeForm = () => {
  const {
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
  } = useIntakeForm();

  const {
    personas,
    summary,
    isGeneratingPersonas,
    isGeneratingPortraits,
    loadingPortraitIndices,
    generatePersonas,
    updatePersona,
    retryPortraitGeneration,
    removePersona,
    personaCount,
    setPersonaCount
  } = usePersonasManager(offering, selectedCountry);
  
  return (
    <QuadrantLayout>
      {{
        q4: (
          <div className="p-[18px]">
            <OrganizationSection 
              brandName={brandName}
              setBrandName={setBrandName}
              industry={industry}
              setIndustry={setIndustry}
              businessDescription={businessDescription}
              setBusinessDescription={setBusinessDescription}
              handleSave={handleSave}
            />
            <IntakeTop />
            <IntakeFormContainer
              brandName={brandName}
              setBrandName={setBrandName}
              industry={industry}
              setIndustry={setIndustry}
              businessDescription={businessDescription}
              setBusinessDescription={setBusinessDescription}
              offering={offering}
              setOffering={setOffering}
              sellingPoints={sellingPoints}
              setSellingPoints={setSellingPoints}
              problemSolved={problemSolved}
              setProblemSolved={setProblemSolved}
              uniqueOffering={uniqueOffering}
              setUniqueOffering={setUniqueOffering}
              adPlatform={adPlatform}
              setAdPlatform={setAdPlatform}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              handleSave={handleSave}
              personas={personas}
              summary={summary}
              isGeneratingPersonas={isGeneratingPersonas}
              isGeneratingPortraits={isGeneratingPortraits}
              generatePersonas={generatePersonas}
              updatePersona={updatePersona}
              loadingPortraitIndices={loadingPortraitIndices}
              retryPortraitGeneration={retryPortraitGeneration}
              removePersona={removePersona}
              personaCount={personaCount}
              setPersonaCount={setPersonaCount}
            />
          </div>
        )
      }}
    </QuadrantLayout>
  );
};

export default IntakeForm;
