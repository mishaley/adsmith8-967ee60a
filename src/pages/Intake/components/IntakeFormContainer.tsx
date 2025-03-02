
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countries } from 'countries-list';
import PersonasSection from "./Personas/PersonasSection";
import { Persona } from "./Personas/types";

interface IntakeFormContainerProps {
  brandName: string;
  setBrandName: (brandName: string) => void;
  industry: string;
  setIndustry: (industry: string) => void;
  offering: string;
  setOffering: (offering: string) => void;
  sellingPoints: string;
  setSellingPoints: (sellingPoints: string) => void;
  problemSolved: string;
  setProblemSolved: (problemSolved: string) => void;
  uniqueOffering: string;
  setUniqueOffering: (uniqueOffering: string) => void;
  adPlatform: string;
  setAdPlatform: (adPlatform: string) => void;
  selectedCountry: string;
  setSelectedCountry: (selectedCountry: string) => void;
  handleSave: () => void;
  personas: Persona[];
  summary: string;
  isGeneratingPersonas: boolean;
  isGeneratingPortraits: boolean;
  generatePersonas: () => void;
  updatePersona?: (index: number, updatedPersona: Persona) => void;
  loadingPortraitIndices?: number[];
  failedPortraitIndices?: number[];
  retryPortraitGeneration?: (index: number) => void;
  removePersona?: (index: number) => void;
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
  failedPortraitIndices,
  retryPortraitGeneration,
  removePersona
}) => {
  // Type definition for country object from countries-list package
  type Country = {
    name: string;
    native: string;
    phone: string;
    continent: string;
    capital: string;
    currency: string;
    languages: string[];
    emoji: string;
    emojiU: string;
  };

  const countryOptions = Object.entries(countries).map(([code, country]: [string, Country]) => ({
    value: code,
    label: country.name,
  }));

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="text-2xl font-bold mb-4">Intake Form</div>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="brandName">Brand Name</Label>
          <Input
            id="brandName"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="offering">Offering</Label>
          <Input
            id="offering"
            value={offering}
            onChange={(e) => setOffering(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="sellingPoints">Selling Points</Label>
          <Textarea
            id="sellingPoints"
            value={sellingPoints}
            onChange={(e) => setSellingPoints(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="problemSolved">Problem Solved</Label>
          <Textarea
            id="problemSolved"
            value={problemSolved}
            onChange={(e) => setProblemSolved(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="uniqueOffering">Unique Offering</Label>
          <Textarea
            id="uniqueOffering"
            value={uniqueOffering}
            onChange={(e) => setUniqueOffering(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="adPlatform">Ad Platform</Label>
          <Input
            id="adPlatform"
            value={adPlatform}
            onChange={(e) => setAdPlatform(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {countryOptions.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSave}>Save</Button>
      </div>

      <div className="mt-8 border rounded-md overflow-hidden bg-white">
        <table className="w-full border-collapse">
          <tbody>
            <PersonasSection
              personas={personas}
              summary={summary}
              isGeneratingPersonas={isGeneratingPersonas}
              isGeneratingPortraits={isGeneratingPortraits}
              generatePersonas={generatePersonas}
              updatePersona={updatePersona}
              loadingPortraitIndices={loadingPortraitIndices}
              failedPortraitIndices={failedPortraitIndices}
              retryPortraitGeneration={retryPortraitGeneration}
              removePersona={removePersona}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IntakeFormContainer;
