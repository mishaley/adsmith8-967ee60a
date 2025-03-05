
import React from "react";
import { Persona } from "../Personas/types";
import { User } from "lucide-react";

interface PersonaCellProps {
  persona: Persona;
  index?: number; // Make index optional
}

const PersonaCell: React.FC<PersonaCellProps> = ({ persona, index = 0 }) => {
  // Ensure interests is always an array and get the first two if available
  const interests = Array.isArray(persona.interests) ? persona.interests : [];
  const firstInterest = interests.length > 0 ? interests[0] : null;
  const secondInterest = interests.length > 1 ? interests[1] : null;

  return (
    <td className="border p-2 align-top">
      <div className="flex items-start">
        {persona.portraitUrl ? (
          <img 
            src={persona.portraitUrl} 
            alt={`Portrait`}
            className="w-12 h-16 rounded-md object-cover mr-2"
          />
        ) : (
          <div className="w-12 h-16 bg-gray-200 rounded-md flex items-center justify-center mr-2">
            <User className="h-5 w-5 text-gray-500" />
          </div>
        )}
        <div className="flex flex-col">
          <div className="text-sm">{persona.gender}</div>
          <div className="text-sm">Age {persona.ageMin}-{persona.ageMax}</div>
          {firstInterest && (
            <div className="text-sm">{firstInterest}</div>
          )}
          {secondInterest && (
            <div className="text-sm">{secondInterest}</div>
          )}
          {!firstInterest && !secondInterest && (
            <div className="text-sm text-gray-500">No interests</div>
          )}
        </div>
      </div>
    </td>
  );
};

export default PersonaCell;
