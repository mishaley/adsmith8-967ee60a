
import React from "react";
import { Loader } from "lucide-react";
import { Persona } from "./types";

interface PersonasListProps {
  personas: Persona[];
  isGeneratingPortraits?: boolean;
}

const PersonasList: React.FC<PersonasListProps> = ({ 
  personas,
  isGeneratingPortraits = false
}) => {
  // Always render 5 columns, populated with personas data when available
  return (
    <tr>
      {Array.from({ length: 5 }).map((_, index) => (
        <td key={index} className="py-3 px-3 border-r align-top" style={{ width: "20%" }}>
          {personas[index] ? (
            <div className="flex flex-col">
              <div className="font-medium">{personas[index].title}</div>
              <div>{personas[index].gender}, age {personas[index].ageMin}-{personas[index].ageMax}</div>
              <div>{personas[index].interests.join(", ")}</div>
              {isGeneratingPortraits && !personas[index].portraitUrl && (
                <div className="text-xs text-gray-500 mt-2 flex items-center">
                  <Loader className="h-3 w-3 animate-spin mr-1" />
                  Generating portrait...
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-400">No persona data</div>
          )}
        </td>
      ))}
    </tr>
  );
};

export default PersonasList;
