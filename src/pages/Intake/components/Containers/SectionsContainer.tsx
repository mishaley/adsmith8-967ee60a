
import React from "react";
import { Persona } from "../Personas/types";
import { Message } from "../Messages/hooks/useMessagesFetching";
import OrganizationContainer from "./OrganizationContainer";
import OfferingContainer from "./OfferingContainer";
import LocationsContainer from "./LocationsContainer";
import PersonasContainer from "./PersonasContainer";
import LanguagesContainer from "./LanguagesContainer";
import MessagesContainer from "./MessagesContainer";
import PlatformsContainer from "./PlatformsContainer";
import ImagesContainer from "./ImagesContainer";
import ParametersCaptionsContainer from "./ParametersCaptionsContainer";
import { ParametersSection } from "../Parameters";

interface SectionsContainerProps {
  brandName: string;
  setBrandName: (value: string) => void;
  industry: string;
  setIndustry: (value: string) => void;
  businessDescription: string;
  setBusinessDescription: (value: string) => void;
  handleSave: () => void;
  
  offering: string;
  setOffering: (value: string) => void;
  sellingPoints: string;
  setSellingPoints: (value: string) => void;
  problemSolved: string;
  setProblemSolved: (value: string) => void;
  uniqueOffering: string;
  setUniqueOffering: (value: string) => void;
  
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
  adPlatform: string;
  setAdPlatform: (value: string) => void;
  
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
  
  personas: Persona[];
  summary: string;
  isGeneratingPersonas: boolean;
  isGeneratingPortraits: boolean;
  generatePersonas: () => void;
  updatePersona: (index: number, updatedPersona: Persona) => void;
  loadingPortraitIndices: number[];
  retryPortraitGeneration: (index: number) => void;
  removePersona: (index: number) => void;
  personaCount: number;
  setPersonaCount: (count: number) => void;
  
  generatedMessages: Record<string, Record<string, Message>>;
  selectedMessageTypes: string[];
  handleUpdateMessages: (messages: Record<string, Record<string, Message>>, types: string[]) => void;
}

const SectionsContainer: React.FC<SectionsContainerProps> = (props) => {
  const {
    brandName,
    setBrandName,
    industry,
    setIndustry,
    businessDescription,
    setBusinessDescription,
    handleSave,
    
    offering,
    setOffering,
    sellingPoints,
    setSellingPoints,
    problemSolved,
    setProblemSolved,
    uniqueOffering,
    setUniqueOffering,
    
    selectedCountry,
    setSelectedCountry,
    adPlatform,
    setAdPlatform,
    
    selectedLanguage,
    setSelectedLanguage,
    
    personas,
    summary,
    isGeneratingPersonas,
    isGeneratingPortraits,
    generatePersonas,
    updatePersona,
    loadingPortraitIndices,
    retryPortraitGeneration,
    removePersona,
    personaCount,
    setPersonaCount,
    
    generatedMessages,
    selectedMessageTypes,
    handleUpdateMessages
  } = props;

  return (
    <>
      <OrganizationContainer
        brandName={brandName}
        setBrandName={setBrandName}
        industry={industry}
        setIndustry={setIndustry}
        businessDescription={businessDescription}
        setBusinessDescription={setBusinessDescription}
        handleSave={handleSave}
      />
      
      <OfferingContainer
        offering={offering}
        setOffering={setOffering}
        sellingPoints={sellingPoints}
        setSellingPoints={setSellingPoints}
        problemSolved={problemSolved}
        setProblemSolved={setProblemSolved}
        uniqueOffering={uniqueOffering}
        setUniqueOffering={setUniqueOffering}
      />
      
      <LocationsContainer
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
      
      <LanguagesContainer
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
      
      <MessagesContainer
        personas={personas}
        generatedMessages={generatedMessages}
        selectedMessageTypes={selectedMessageTypes}
        handleUpdateMessages={handleUpdateMessages}
      />
      
      <PlatformsContainer
        adPlatform={adPlatform}
        setAdPlatform={setAdPlatform}
      />
      
      <ImagesContainer
        personas={personas}
        generatedMessages={generatedMessages}
        selectedMessageTypes={selectedMessageTypes}
        adPlatform={adPlatform}
      />
      
      <ParametersCaptionsContainer
        personas={personas}
        generatedMessages={generatedMessages}
        selectedMessageTypes={selectedMessageTypes}
        adPlatform={adPlatform}
      />
      
      <ParametersSection />
    </>
  );
};

export default SectionsContainer;
