
import React, { useState } from "react";
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
import { ParametersSection } from "./components/Parameters";
import { Message } from "./components/Messages/hooks/useMessagesFetching";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { clearFormAndRefresh } from "./utils/localStorageUtils";
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
import { useToast } from "@/components/ui/use-toast";

const IntakeForm = () => {
  const { toast } = useToast();
  
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

  // State for messages data to share between components
  const [generatedMessages, setGeneratedMessages] = useState<Record<string, Record<string, Message>>>({});
  const [selectedMessageTypes, setSelectedMessageTypes] = useState<string[]>(["tagline"]);

  // Handler for receiving updated messages from MessagesContainer
  const handleUpdateMessages = (messages: Record<string, Record<string, Message>>, types: string[]) => {
    console.log("IntakeForm: Messages updated", { messageTypesCount: types.length, personasCount: personas.length });
    setGeneratedMessages(messages);
    setSelectedMessageTypes(types);
  };

  const handleClearForm = () => {
    clearFormAndRefresh();
  };

  return <QuadrantLayout>
      {{
      q4: <div className="p-[18px] pl-0 pt-0 relative">
            {/* Clear Form Button */}
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
    }}
    </QuadrantLayout>;
};

export default IntakeForm;
