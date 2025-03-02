
import React from "react";
import IntakeHeader from "./IntakeHeader";
import IntakeFormFields from "./IntakeFormFields";
import PersonasSection from "./Personas/PersonasSection";
import GeoMapSection from "./GeoMap/GeoMapSection";
import CountrySelector from "./CountrySelector";
import { Persona } from "./Personas/types";

interface IntakeFormContainerProps {
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
  personas: Persona[];
  summary: string;
  isGeneratingPersonas: boolean;
  isGeneratingPortraits: boolean;
  generatePersonas: () => void;
  updatePersona?: (index: number, updatedPersona: Persona) => void;
  loadingPortraitIndices?: number[];
  retryPortraitGeneration?: (index: number) => void;
}

const IntakeFormContainer: React.FC<IntakeFormContainerProps> = ({
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
  personas,
  summary,
  isGeneratingPersonas,
  isGeneratingPortraits,
  generatePersonas,
  updatePersona,
  loadingPortraitIndices,
  retryPortraitGeneration
}) => {
  return (
    <div className="min-h-screen pb-10">
      <IntakeHeader 
        title="New Campaign" 
        subtitle={`We're going to collect some information about ${brandName || "your brand"} to help us understand your business better.`} 
      />
      
      <div className="w-full rounded-md overflow-hidden">
        <table className="w-full border-collapse bg-[#d3e4fd]">
          <tbody>
            <IntakeFormFields
              brandName={brandName}
              setBrandName={setBrandName}
              industry={industry}
              setIndustry={setIndustry}
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
            
            <tr className="border-b">
              <td className="py-4 pr-4 text-lg pl-4">
                <div>Country</div>
              </td>
              <td className="py-4">
                <CountrySelector
                  selectedCountry={selectedCountry}
                  setSelectedCountry={setSelectedCountry}
                />
              </td>
            </tr>
            
            <GeoMapSection
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
            />
            
            <PersonasSection
              personas={personas}
              summary={summary}
              isGeneratingPersonas={isGeneratingPersonas}
              isGeneratingPortraits={isGeneratingPortraits}
              generatePersonas={generatePersonas}
              updatePersona={updatePersona}
              loadingPortraitIndices={loadingPortraitIndices}
              retryPortraitGeneration={retryPortraitGeneration}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IntakeFormContainer;
