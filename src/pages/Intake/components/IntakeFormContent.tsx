
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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
import IntakeTop from "./IntakeTop";
import IntakeFormContainer from "./IntakeFormContainer";
import SectionsContainer from "./Containers/SectionsContainer";
import SummaryTable from "./SummaryTable";
import { Persona } from "./Personas/types";
import { Message } from "./Messages/hooks/useMessagesFetching";

interface IntakeFormContentProps {
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
  
  handleClearForm: () => void;
}

const IntakeFormContent: React.FC<IntakeFormContentProps> = (props) => {
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
              <AlertDialogAction onClick={props.handleClearForm}>Clear Data</AlertDialogAction>
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
      
      {/* Add the summary table above the sections container */}
      <SummaryTable />
      
      <SectionsContainer {...props} />
      
      <IntakeTop />
      <IntakeFormContainer {...props} />
    </div>
  );
};

export default IntakeFormContent;
