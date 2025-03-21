import React, { useState, useEffect } from "react";
import { useIntakeForm } from "./hooks/useIntakeForm";
import { useQueryClient } from "@tanstack/react-query";
import QuadrantLayout from "@/components/QuadrantLayout";
import SectionsContainer from "./components/Containers/SectionsContainer"; 
import { usePersonasManager } from "./hooks/personas/usePersonasManager";
import { OrganizationSelector } from "@/components/OrganizationSelector";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2 } from "lucide-react";
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
import { clearFormAndRefresh } from "./utils/localStorage";
import { useOrganizationData } from "./hooks/useOrganizationData";
import { useOfferingData } from "./hooks/useOfferingData";
import { logDebug } from "@/utils/logging";

const IntakeForm: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isClearingForm, setIsClearingForm] = useState(false);
  
  // Get organization and offering data
  const { selectedOrgId } = useOrganizationData();
  const { selectedOfferingId,  setSelectedOfferingId } = useOfferingData(selectedOrgId);
  
  // Debug logging for the offering ID
  useEffect(() => {
    logDebug(`IntakeForm - selectedOfferingId: ${selectedOfferingId || 'not set'}`, 'ui');
  }, [selectedOfferingId]);
  
  useEffect(() => {
    // @ts-ignore
    window.queryClient = queryClient;
    return () => {
      // @ts-ignore
      delete window.queryClient;
    };
  }, [queryClient]);
  
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
    selectedCountries,
    setSelectedCountries,
    adPlatform,
    setAdPlatform,
    selectedLanguages,
    setSelectedLanguages,
    excludedCountries,
    setExcludedCountries,
    setPersonas,
    generatedMessages,
    setGeneratedMessages,
    selectedMessageTypes,
    setSelectedMessageTypes,
    handleSave,
    selectedPersonaId,
    setSelectedPersonaId
  } = useIntakeForm();

  const {
    personas: loadedPersonas,
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
  } = usePersonasManager(offering, selectedCountries.length > 0 ? selectedCountries[0] : "");

  const handleUpdateMessages = (
    updatedMessages: any,
    updatedTypes: string[]
  ) => {
    setGeneratedMessages(updatedMessages);
    setSelectedMessageTypes(updatedTypes);
  };

  const handleClearForm = () => {
    try {
      setIsClearingForm(true);
      // Show a toast notification
      toast({
        title: "Clearing form data",
        description: "Removing all form data and resetting the page...",
      });
      
      // Invalidate query cache first
      queryClient.invalidateQueries();
      
      // Small delay to allow the UI to update before refresh
      setTimeout(() => {
        clearFormAndRefresh();
      }, 300);
    } catch (error) {
      console.error("Error clearing form:", error);
      toast({
        title: "Error clearing form",
        description: "There was a problem clearing the form data. Please try again.",
        variant: "destructive"
      });
      setIsClearingForm(false);
    }
  };

  return (
    <QuadrantLayout>
      {{
        q1: <OrganizationSelector />,
        q4: (
          <div className="bg-#d3e4fd rounded-2xl shadow-sm p-4 relative overflow-hidden max-w-6xl mx-auto">
            <div className="mb-6 text-center">
              <p className="mb-4 text-2xl">Welcome to Adsmith! Your marketing ROI is our only focus.</p>
              <p className="mb-4 text-2xl">
                Let's get a demo campaign set up. It'll only take a few minutes.
              </p>
            </div>
            
            <div className="absolute top-0 right-0 z-10 mr-6 mt-6">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Trash2 className="h-4 w-4" />
                    Clear Form
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear All Form Data</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will clear all your form data including your organization details, offering, 
                      personas, messages, and other selections. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isClearingForm}>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleClearForm} 
                      disabled={isClearingForm}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      {isClearingForm ? "Clearing..." : "Clear All Data"}
                    </AlertDialogAction>
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
              setSelectedOfferingId={setSelectedOfferingId}
              selectedCountries={selectedCountries}
              setSelectedCountries={setSelectedCountries}
              adPlatform={adPlatform}
              setAdPlatform={setAdPlatform}
              
              selectedLanguages={selectedLanguages}
              setSelectedLanguages={setSelectedLanguages}
              
              excludedCountries={excludedCountries}
              setExcludedCountries={setExcludedCountries}
              
              personas={loadedPersonas}
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
              
              isSegmented={isSegmented}
              setIsSegmented={setIsSegmented}
              selectedPersonaId={selectedPersonaId}
              setSelectedPersonaId={setSelectedPersonaId}
              selectedOfferingId={selectedOfferingId}
            />
          </div>
        )
      }}
    </QuadrantLayout>
  );
};

export default IntakeForm;
