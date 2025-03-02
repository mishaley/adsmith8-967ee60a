
import React from "react";
import QuadrantLayout from "@/components/QuadrantLayout";
import IntakeFormContainer from "./components/IntakeFormContainer";
import { useIntakeForm } from "./hooks/useIntakeForm";
import { usePersonasManager } from "./hooks/personas/usePersonasManager";

const IntakeForm = () => {
  const {
    brandName,
    setBrandName,
    industry,
    setIndustry,
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
  } = useIntakeForm();

  const {
    personas,
    summary,
    isGeneratingPersonas,
    isGeneratingPortraits,
    loadingPortraitIndices,
    failedPortraitIndices,
    generatePersonas,
    updatePersona,
    retryPortraitGeneration,
    removePersona
  } = usePersonasManager(offering, selectedCountry);
  
  return (
    <QuadrantLayout>
      {{
        q4: (
          <IntakeFormContainer
            brandName={brandName}
            setBrandName={setBrandName}
            industry={industry}
            setIndustry={setIndustry}
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
            handleSave={handleSave}
            personas={personas}
            summary={summary}
            isGeneratingPersonas={isGeneratingPersonas}
            isGeneratingPortraits={isGeneratingPortraits}
            generatePersonas={generatePersonas}
            updatePersona={updatePersona}
            loadingPortraitIndices={loadingPortraitIndices}
            failedPortraitIndices={failedPortraitIndices}
            retryPortraitGeneration={retryPortraitGeneration}
            removePersona={removePersona}
          />
        )
      }}
    </QuadrantLayout>
  );
};

export default IntakeForm;
