import React from "react";
import { Persona } from "../Personas/types";
import { Message } from "../Messages/hooks/useMessagesFetching";
import OrganizationContainer from "./OrganizationContainer";
import OfferingContainer from "./OfferingContainer";
import LocationsContainer from "./LocationsContainer";
import PersonasContainer from "./PersonasContainer";
import MessagesContainer from "./MessagesContainer";
import PlatformsContainer from "./PlatformsContainer";
import ImagesContainer from "./ImagesContainer";
import ParametersCaptionsContainer from "./ParametersCaptionsContainer";
import { ParametersSection } from "../Parameters";
import { LaunchSection } from "../Launch";

interface SectionsContainerProps {
  brandName: string;
  setBrandName: (value: string) => void;
  industry: string;
  setIndustry: (value: string) => void;
  handleSave: () => void;

  offering: string;
  setOffering: (value: string) => void;
  sellingPoints: string;
  setSellingPoints: (value: string) => void;
  problemSolved: string;
  setProblemSolved: (value: string) => void;
  uniqueOffering: string;
  setUniqueOffering: (value: string) => void;

  adPlatform: string;
  setAdPlatform: (value: string) => void;

  selectedCountries: string[];
  setSelectedCountries: (values: string[]) => void;
  selectedLanguages: string[];
  setSelectedLanguages: (values: string[]) => void;
  excludedCountries: string[];
  setExcludedCountries: (values: string[]) => void;

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

  isSegmented?: boolean;
  setIsSegmented?: (isSegmented: boolean) => void;

  generatedMessages: Record<string, Record<string, Message>>;
  selectedMessageTypes: string[];
  handleUpdateMessages: (
    messages: Record<string, Record<string, Message>>,
    types: string[]
  ) => void;
  setSelectedOfferingId?: (value: string) => void;
  selectedOfferingId?: string; // Add this new prop
  setSelectedPersonaId?: (value: string) => void;
  selectedPersonaId?: string; // Add this new prop
}

const SectionsContainer: React.FC<SectionsContainerProps> = (props) => {
  const {
    brandName,
    setBrandName,
    industry,
    setIndustry,
    handleSave,

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

    selectedCountries,
    setSelectedCountries,
    selectedLanguages,
    setSelectedLanguages,
    excludedCountries,
    setExcludedCountries,

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
    isSegmented,
    setIsSegmented,

    generatedMessages,
    selectedMessageTypes,
    handleUpdateMessages,

    selectedOfferingId,
    setSelectedOfferingId,

    selectedPersonaId,
    setSelectedPersonaId,
  } = props;

  return (
    <>
      <OrganizationContainer
        brandName={brandName}
        setBrandName={setBrandName}
        industry={industry}
        setIndustry={setIndustry}
        handleSave={handleSave}
      />

      <OfferingContainer
        setSelectedOfferingId={setSelectedOfferingId}
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
        selectedCountries={selectedCountries}
        setSelectedCountries={setSelectedCountries}
        selectedLanguages={selectedLanguages}
        setSelectedLanguages={setSelectedLanguages}
        excludedCountries={excludedCountries}
        setExcludedCountries={setExcludedCountries}
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
        isSegmented={isSegmented}
        setIsSegmented={setIsSegmented}
        selectedOfferingId={selectedOfferingId}
        setSelectedPersonaId={setSelectedPersonaId}
        selectedPersonaId={selectedPersonaId}
      />

      <MessagesContainer
        selectedPersonaId={selectedPersonaId}
        personas={personas}
        generatedMessages={generatedMessages}
        selectedMessageTypes={selectedMessageTypes}
        handleUpdateMessages={handleUpdateMessages}
        isSegmented={isSegmented}
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

      <LaunchSection />
    </>
  );
};

export default SectionsContainer;
