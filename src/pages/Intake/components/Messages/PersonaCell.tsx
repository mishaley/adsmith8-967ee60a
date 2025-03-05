
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
      <div className="flex items-start space-x-2 w-auto">
        {/* Portrait container with fixed width */}
        <div className="flex-shrink-0" style={{ width: "80px" }}>
          {persona.portraitUrl ? (
            <img 
              src={persona.portraitUrl} 
              alt={`Portrait`}
              className="w-20 h-20 rounded-md object-cover"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
              <User className="h-6 w-6 text-gray-500" />
            </div>
          )}
        </div>
        
        {/* Text content with natural width */}
        <div className="flex flex-col min-w-fit">
          <div className="text-sm whitespace-nowrap">{persona.gender}</div>
          <div className="text-sm whitespace-nowrap">Age {persona.ageMin}-{persona.ageMax}</div>
          {firstInterest && (
            <div className="text-sm whitespace-nowrap">{firstInterest}</div>
          )}
          {secondInterest && (
            <div className="text-sm whitespace-nowrap">{secondInterest}</div>
          )}
          {!firstInterest && !secondInterest && (
            <div className="text-sm text-gray-500 whitespace-nowrap">No interests</div>
          )}
        </div>
      </div>
    </td>
  );
};

export default PersonaCell;
