
import React from "react";
import QuadrantLayout from "@/components/QuadrantLayout";
import IntakeFormContainer from "./components/IntakeFormContainer";
import IntakeTop from "./components/IntakeTop";
import { useIntakeForm } from "./hooks/useIntakeForm";
import { usePersonasManager } from "./hooks/personas/usePersonasManager";
import OrganizationSection from "./components/OrganizationSection";
import OfferingSection from "./components/OfferingSection";
import LocationsSection from "./components/LocationsSection";
import PersonasContainer from "./components/PersonasSection";
import LanguagesSection from "./components/Languages/LanguagesSection";
import MessagesContainer from "./components/Messages/MessagesContainer";
import PlatformsSection from "./components/Platforms/PlatformsSection";
import { ImagesSection } from "./components/Images";
import { CaptionsSection } from "./components/Captions";

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

  return <QuadrantLayout>
      {{
      q4: <div className="p-[18px] pl-0 pt-0">
            <div className="mb-6 text-center">
              <p className="mb-4 text-2xl">Welcome to Adsmith! Your marketing ROI is our only focus.</p>
              <p className="mb-4 text-2xl">
                Let's get a demo campaign set up. It'll only take a few minutes.
              </p>
            </div>
            <OrganizationSection 
              brandName={brandName} 
              setBrandName={setBrandName} 
              industry={industry} 
              setIndustry={setIndustry} 
              businessDescription={businessDescription} 
              setBusinessDescription={setBusinessDescription} 
              handleSave={handleSave} 
            />
            <OfferingSection
              offering={offering}
              setOffering={setOffering}
              sellingPoints={sellingPoints}
              setSellingPoints={setSellingPoints}
              problemSolved={problemSolved}
              setProblemSolved={setProblemSolved}
              uniqueOffering={uniqueOffering}
              setUniqueOffering={setUniqueOffering}
            />
            <LocationsSection
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
            />
            <PersonasContainer
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
            <LanguagesSection 
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
            />
            <MessagesContainer
              personas={personas}
              onUpdateMessages={(messages, types) => {
                // Store messages data for passing to IntakeFormContainer
                const updatedMessages = messages;
                const updatedTypes = types;
                
                // We pass this through to IntakeFormContainer for image generation
                if (IntakeFormContainer) {
                  IntakeFormContainer.generatedMessages = updatedMessages;
                  IntakeFormContainer.selectedMessageTypes = updatedTypes;
                }
              }}
            />
            <PlatformsSection
              adPlatform={adPlatform}
              setAdPlatform={setAdPlatform}
            />
            <ImagesSection 
              personas={personas}
              generatedMessages={IntakeFormContainer.generatedMessages || {}}
              selectedMessageTypes={IntakeFormContainer.selectedMessageTypes || ["tagline"]}
              adPlatform={adPlatform}
            />
            <CaptionsSection />
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
    }}
    </QuadrantLayout>;
};

export default IntakeForm;
