
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader, Image } from "lucide-react";
import PersonasList from "./PersonasList";
import PortraitRow from "./PortraitRow";
import { usePersonaPortraits } from "./usePersonaPortraits";
import { Persona } from "./types";

interface PersonasSectionProps {
  personas: Persona[];
  summary: string;
  isGeneratingPersonas: boolean;
  generatePersonas: () => void;
  updatePersona?: (index: number, updatedPersona: Persona) => void;
}

const PersonasSection: React.FC<PersonasSectionProps> = ({
  personas,
  summary,
  isGeneratingPersonas,
  generatePersonas,
  updatePersona
}) => {
  const {
    generatingPortraitFor,
    generatingAllPortraits,
    generatePortrait,
    generateAllPortraits
  } = usePersonaPortraits(personas, updatePersona);

  return (
    <>
      <tr className="border-b">
        <td colSpan={2} className="py-4 text-lg">
          <div className="w-full text-left pl-4 flex items-center">
            <span>Personas</span>
            <Button 
              onClick={generatePersonas} 
              disabled={isGeneratingPersonas}
              className="ml-4"
              size="sm"
            >
              {isGeneratingPersonas ? "Generating..." : "Generate"}
            </Button>
            <Button 
              onClick={generateAllPortraits} 
              disabled={generatingAllPortraits || generatingPortraitFor !== null || personas.length === 0}
              className="ml-2"
              size="sm"
              variant="outline"
            >
              {generatingAllPortraits ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Image className="h-4 w-4 mr-2" />
                  Portraits
                </>
              )}
            </Button>
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan={2} className="p-0">
          <div className="w-full">
            <table className="w-full border-collapse">
              <tbody>
                <PersonasList personas={personas} />
                <PortraitRow 
                  personas={personas} 
                  generatePortrait={generatePortrait}
                  generatingPortraitFor={generatingPortraitFor}
                  generatingAllPortraits={generatingAllPortraits}
                />
                {/* Empty row for spacing/alignment */}
                <tr>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <td key={index} className="py-4 px-2 border-r" style={{ width: "20%" }}></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    </>
  );
};

export default PersonasSection;
