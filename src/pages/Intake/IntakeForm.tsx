
import React from "react";
import QuadrantLayout from "@/components/QuadrantLayout";
import IntakeFormContainer from "./components/IntakeFormContainer";
import { useIntakeForm } from "./hooks/useIntakeForm";
import { usePersonasGeneration } from "./hooks/usePersonasGeneration";

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
    generatePersonas,
    updatePersona,
    retryPortraitGeneration
  } = usePersonasGeneration(offering, selectedCountry);
  
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
            retryPortraitGeneration={retryPortraitGeneration}
          />
        )
      }}
    </QuadrantLayout>
  );
};

export default IntakeForm;
