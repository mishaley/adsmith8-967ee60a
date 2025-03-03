
import React, { useState } from "react";
import IntakeHeader from "./IntakeHeader";
import IntakeFormFields from "./IntakeFormFields";
import { Persona } from "./Personas/types";
import { ImagesSection } from "./Images";
import { Message } from "./Messages/hooks/useMessagesFetching";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select";

interface IntakeFormContainerProps {
  // Form fields
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

  // Personas
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
}

// Add static properties to store messages data shared between components
interface IntakeFormContainerType extends React.FC<IntakeFormContainerProps> {
  generatedMessages?: Record<string, Record<string, Message>>;
  selectedMessageTypes?: string[];
}

const PLATFORM_OPTIONS = ["Google", "Meta"];

const IntakeFormContainer: IntakeFormContainerType = ({
  // Form fields
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
  // Personas
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
  setPersonaCount
}) => {
  // Use the static properties for messages data, or default to empty if not set
  const generatedMessages = IntakeFormContainer.generatedMessages || {};
  const selectedMessageTypes = IntakeFormContainer.selectedMessageTypes || ["tagline"];
  
  return <div className="bg-#d3e4fd rounded-2xl shadow-sm p-4 relative overflow-hidden max-w-6xl mx-auto">
      <IntakeHeader />
      <table className="w-full border-collapse">
        <tbody>
          <IntakeFormFields 
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
            handleSave={handleSave} 
          />
          
          {/* MessagesSection has been moved to a separate container component */}
          
          {/* Ad Platform Section */}
          <tr className="border-b">
            <td colSpan={2} className="py-4 text-lg">
              <div className="w-full text-left pl-4 flex items-center">
                <span>Platforms</span>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={2} className="py-4 pl-4">
              <div className="inline-block min-w-[180px]">
                <Select value={adPlatform} onValueChange={value => {
                if (value === "clear-selection") {
                  setAdPlatform("");
                } else {
                  setAdPlatform(value);
                }
              }}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent className="bg-white min-w-[var(--radix-select-trigger-width)] w-fit">
                    {PLATFORM_OPTIONS.map(platform => <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>)}
                    <SelectSeparator className="my-1" />
                    <SelectItem value="clear-selection" className="text-gray-500">
                      Clear
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </td>
          </tr>
          
          <ImagesSection personas={personas} generatedMessages={generatedMessages} selectedMessageTypes={selectedMessageTypes} adPlatform={adPlatform} />
        </tbody>
      </table>
    </div>;
};

// Initialize static properties
IntakeFormContainer.generatedMessages = {};
IntakeFormContainer.selectedMessageTypes = ["tagline"];

export default IntakeFormContainer;
