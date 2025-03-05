
import React from "react";
import { Persona } from "../Personas/types";
import { User } from "lucide-react";

interface PersonaCellProps {
  persona: Persona;
  index?: number; // Make index optional
}

const PersonaCell: React.FC<PersonaCellProps> = ({ persona, index = 0 }) => {
  return (
    <td className="border p-2 align-top">
      <div className="flex items-center">
        {persona.portraitUrl ? (
          <img 
            src={persona.portraitUrl} 
            alt={`Portrait of ${persona.title || `Persona ${index + 1}`}`}
            className="w-12 h-12 rounded-md object-cover mr-2"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center mr-2">
            <User className="h-6 w-6 text-gray-500" />
          </div>
        )}
        <div>
          <div className="font-medium text-sm">{persona.title || `Persona ${index + 1}`}</div>
          <div className="text-xs text-gray-500">
            {persona.gender}, {persona.ageMin}-{persona.ageMax}
          </div>
          {persona.interests && persona.interests.length > 0 ? (
            <div className="text-xs text-gray-500 max-w-[150px] truncate">
              {persona.interests.slice(0, 2).join(", ")}
              {persona.interests.length > 2 ? "..." : ""}
            </div>
          ) : (
            <div className="text-xs text-gray-500">No interests</div>
          )}
        </div>
      </div>
    </td>
  );
};

export default PersonaCell;
