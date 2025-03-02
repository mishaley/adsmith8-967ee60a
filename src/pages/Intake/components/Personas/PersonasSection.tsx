
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import PersonasList from "./PersonasList";
import PortraitRow from "./PortraitRow";
import { Persona } from "./types";

interface PersonasSectionProps {
  personas: Persona[];
  summary: string;
  isGeneratingPersonas: boolean;
  isGeneratingPortraits: boolean;
  generatePersonas: () => void;
  updatePersona?: (index: number, updatedPersona: Persona) => void;
}

const PersonasSection: React.FC<PersonasSectionProps> = ({
  personas,
  summary,
  isGeneratingPersonas,
  isGeneratingPortraits,
  generatePersonas,
  updatePersona
}) => {
  console.log("PersonasSection rendering with personas:", personas);

  return (
    <>
      <tr className="border-b">
        <td colSpan={2} className="py-4 text-lg">
          <div className="w-full text-left pl-4 flex items-center">
            <span>Personas</span>
            <Button 
              onClick={generatePersonas} 
              disabled={isGeneratingPersonas || isGeneratingPortraits}
              className="ml-4"
              size="sm"
            >
              {isGeneratingPersonas ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Generating Personas...
                </>
              ) : isGeneratingPortraits ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Generating Portraits...
                </>
              ) : "Generate"}
            </Button>
          </div>
        </td>
      </tr>
      {isGeneratingPersonas ? (
        <tr>
          <td colSpan={2} className="py-8 text-center">
            <Loader className="h-8 w-8 animate-spin mx-auto" />
            <div className="mt-4 text-gray-500">Generating personas...</div>
          </td>
        </tr>
      ) : (
        <tr>
          <td colSpan={2} className="p-0">
            <div className="w-full">
              <table className="w-full border-collapse">
                <tbody>
                  <PersonasList personas={personas} />
                  <PortraitRow 
                    personas={personas}
                    isGeneratingPortraits={isGeneratingPortraits}
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
      )}
    </>
  );
};

export default PersonasSection;
