import React from "react";
import IntakeHeader from "./IntakeHeader";
import IntakeFormFields from "./IntakeFormFields";
import GeoMapSection from "./GeoMap/GeoMapSection";
import PersonasSection from "./Personas/PersonasSection";
import { Persona } from "./Personas/types";
interface IntakeFormContainerProps {
  // Form fields
  brandName: string;
  setBrandName: (value: string) => void;
  industry: string;
  setIndustry: (value: string) => void;
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
  handleSave: () => void;

  // Personas
  personas: Persona[];
  summary: string;
  isGeneratingPersonas: boolean;
  isGeneratingPortraits: boolean;
  generatePersonas: () => void;
  updatePersona: (index: number, updatedPersona: Persona) => void;
  loadingPortraitIndices?: number[];
  retryPortraitGeneration?: (index: number) => void;
}
const IntakeFormContainer: React.FC<IntakeFormContainerProps> = ({
  // Form fields
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
  handleSave,
  // Personas
  personas,
  summary,
  isGeneratingPersonas,
  isGeneratingPortraits,
  generatePersonas,
  updatePersona,
  loadingPortraitIndices,
  retryPortraitGeneration
}) => {
  return <div className="p-4 min-h-[calc(100vh-60px)] bg-#d3e4fd">
      <IntakeHeader />
      
      <div className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <tbody>
              <IntakeFormFields brandName={brandName} setBrandName={setBrandName} industry={industry} setIndustry={setIndustry} offering={offering} setOffering={setOffering} sellingPoints={sellingPoints} setSellingPoints={setSellingPoints} problemSolved={problemSolved} setProblemSolved={setProblemSolved} uniqueOffering={uniqueOffering} setUniqueOffering={setUniqueOffering} adPlatform={adPlatform} setAdPlatform={setAdPlatform} handleSave={handleSave} />
              
              <GeoMapSection selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
              
              <PersonasSection personas={personas} summary={summary} isGeneratingPersonas={isGeneratingPersonas} isGeneratingPortraits={isGeneratingPortraits} generatePersonas={generatePersonas} updatePersona={updatePersona} loadingPortraitIndices={loadingPortraitIndices} retryPortraitGeneration={retryPortraitGeneration} />
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};
export default IntakeFormContainer;