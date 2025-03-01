
import React from "react";
import { Button } from "@/components/ui/button";

interface Persona {
  title: string;
  gender: string;
  ageMin: number;
  ageMax: number;
  interests: string[];
}

interface PersonasSectionProps {
  personas: Persona[];
  summary: string;
  isGeneratingPersonas: boolean;
  generatePersonas: () => void;
}

const PersonasSection: React.FC<PersonasSectionProps> = ({
  personas,
  summary,
  isGeneratingPersonas,
  generatePersonas
}) => {
  return (
    <>
      <tr className="border-b">
        <td colSpan={2} className="py-4 text-lg">
          <div className="w-full text-left pl-4"></div>
        </td>
      </tr>
      <tr className="border-b">
        <td colSpan={2} className="py-4 text-lg">
          <div className="w-full text-left pl-4 flex items-center justify-between">
            <span>Personas</span>
            <Button 
              onClick={generatePersonas} 
              disabled={isGeneratingPersonas}
              className="mr-4"
            >
              {isGeneratingPersonas ? "Generating..." : "Generate Personas"}
            </Button>
          </div>
        </td>
      </tr>
      <tr className="border-b">
        <td colSpan={2} className="py-4 text-lg">
          <div className="w-full text-left pl-4"></div>
        </td>
      </tr>
      <tr className="border-b">
        <td colSpan={5} className="py-4 px-2 text-base">
          {summary ? (
            <div className="bg-gray-50 p-3 rounded-md">{summary}</div>
          ) : (
            <div className="text-gray-400 italic">Click "Generate Personas" to create target audience profiles</div>
          )}
        </td>
      </tr>
      <tr className="border-b">
        <td className="p-0">
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                {personas.length > 0 ? (
                  personas.map((persona, index) => (
                    <td key={index} className="py-3 px-3 border-r align-top w-1/5" style={{ width: "20%" }}>
                      <div className="flex flex-col h-full">
                        <div className="font-medium">{persona.title}</div>
                        <div>{persona.gender}</div>
                        <div>{persona.ageMin}-{persona.ageMax}</div>
                        <div>{persona.interests.join(", ")}</div>
                      </div>
                    </td>
                  ))
                ) : (
                  Array.from({ length: 5 }).map((_, index) => (
                    <td key={index} className="py-4 px-2 border-r" style={{ width: "20%" }}></td>
                  ))
                )}
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
      <tr className="border-b">
        <td className="p-0">
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                {Array.from({ length: 5 }).map((_, index) => (
                  <td key={index} className="py-4 px-2 border-r" style={{ width: "20%" }}></td>
                ))}
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </>
  );
};

export default PersonasSection;
