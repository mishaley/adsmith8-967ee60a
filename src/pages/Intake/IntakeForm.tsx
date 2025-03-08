
import React from "react";
import { useIntakeForm } from "./hooks/useIntakeForm";
import QuadrantLayout from "@/components/QuadrantLayout";
import SectionsContainer from "./components/Containers/SectionsContainer"; 
import { usePersonasManager } from "./hooks/personas/usePersonasManager";
import { OrganizationSelector } from "@/components/OrganizationSelector";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
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
import { clearFormAndRefresh } from "./utils/localStorageUtils";

const IntakeForm: React.FC = () => {
  // Get all form state and handlers from the hook
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
    selectedCountry,
    setSelectedCountry,
    adPlatform,
    setAdPlatform,
    selectedLanguage,
    setSelectedLanguage,
    // Add multi-select state
    selectedCountries,
    setSelectedCountries,
    selectedLanguages,
    setSelectedLanguages,
    personas,
    setPersonas,
    generatedMessages,
    setGeneratedMessages,
    selectedMessageTypes,
    setSelectedMessageTypes,
    handleSave
  } = useIntakeForm();

  // Get personas-related functionality
  const {
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
  } = usePersonasManager(offering, selectedCountry);

  // Handler to update messages state
  const handleUpdateMessages = (
    updatedMessages: any,
    updatedTypes: string[]
  ) => {
    setGeneratedMessages(updatedMessages);
    setSelectedMessageTypes(updatedTypes);
  };

  return (
    <QuadrantLayout>
      {{
        q1: <OrganizationSelector />,
        q4: (
          <div className="bg-#d3e4fd rounded-2xl shadow-sm p-4 relative overflow-hidden max-w-6xl mx-auto">
            {/* Welcome Text */}
            <div className="mb-6 text-center">
              <p className="mb-4 text-2xl">Welcome to Adsmith! Your marketing ROI is our only focus.</p>
              <p className="mb-4 text-2xl">
                Let's get a demo campaign set up. It'll only take a few minutes.
              </p>
            </div>
            
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
                    <AlertDialogAction onClick={clearFormAndRefresh}>Clear Data</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <SectionsContainer
              brandName={brandName}
              setBrandName={setBrandName}
              industry={industry}
              setIndustry={setIndustry}
              handleSave={handleSave}
              
              offering={offering}
              setOffering={setOffering}
              sellingPoints={sellingPoints}
              setSellingPoints={setSellingPoints}
              problemSolved={problemSolved}
              setProblemSolved={setProblemSolved}
              uniqueOffering={uniqueOffering}
              setUniqueOffering={setUniqueOffering}
              
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              adPlatform={adPlatform}
              setAdPlatform={setAdPlatform}
              
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              
              // Add multi-select props
              selectedCountries={selectedCountries}
              setSelectedCountries={setSelectedCountries}
              selectedLanguages={selectedLanguages}
              setSelectedLanguages={setSelectedLanguages}
              
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
              
              generatedMessages={generatedMessages}
              selectedMessageTypes={selectedMessageTypes}
              handleUpdateMessages={handleUpdateMessages}
            />
          </div>
        )
      }}
    </QuadrantLayout>
  );
};

export default IntakeForm;
