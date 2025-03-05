
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { clearFormAndRefresh } from "../utils/localStorageUtils";
import OrganizationSection from "./OrganizationSection";
import OfferingSection from "./OfferingSection";
import LocationsSection from "./LocationsSection";
import PersonasContainer from "./PersonasSection";
import LanguagesSection from "./Languages/LanguagesSection";
import MessagesContainer from "./Messages/MessagesContainer";
import PlatformsSection from "./Platforms/PlatformsSection";
import { ImagesSection } from "./Images";
import { CaptionsSection } from "./Captions";
import { ParametersSection } from "./Parameters";
import IntakeTop from "./IntakeTop";
import IntakeFormContainer from "./IntakeFormContainer";
import { Message } from "./Messages/hooks/useMessagesFetching";
import { Persona } from "./Personas/types";

interface IntakeFormContentProps {
  brandName: string;
  setBrandName: (value: string) => void;
  industry: string;
  setIndustry: (value: string) => void;
  businessDescription: string;
  setBusinessDescription: (value: string) => void;
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
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
  handleSave: () => void;
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
  handleClearForm: () => void;
}

const IntakeFormContent: React.FC<IntakeFormContentProps> = ({
  // All the props
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
  handleSave,
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
  handleUpdateMessages,
  handleClearForm
}) => {
  return (
    <div className="p-[18px] pl-0 pt-0 relative">
      <div className="absolute top-0 right-0 z-10 mr-6 mt-6">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              Clear Form
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear Form Data</AlertDialogTitle>
              <AlertDialogDescription>
                This will clear all your form data and reset the form. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearForm}>Clear Data</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
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
        onUpdateMessages={handleUpdateMessages}
      />
      
      <PlatformsSection
        adPlatform={adPlatform}
        setAdPlatform={setAdPlatform}
      />
      
      <ImagesSection 
        personas={personas}
        generatedMessages={generatedMessages}
        selectedMessageTypes={selectedMessageTypes}
        adPlatform={adPlatform}
      />
      
      <CaptionsSection />
      <ParametersSection />
      
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
  );
};

export default IntakeFormContent;
