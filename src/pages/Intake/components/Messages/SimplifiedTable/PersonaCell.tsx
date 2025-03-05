
import React from "react";
import { Persona } from "../../Personas/types";

interface PersonaCellProps {
  persona: Persona | null;
}

const PersonaCell: React.FC<PersonaCellProps> = ({ persona }) => {
  if (!persona) {
    return (
      <div className="flex items-center">
        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center mr-2 overflow-hidden">
          {/* Empty state without any text */}
        </div>
        <div>{/* No "Not available" text */}</div>
      </div>
    );
  }

  // Ensure interests is always an array
  const interests = Array.isArray(persona.interests) ? persona.interests : [];

  return (
    <div className="flex items-center">
      <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center mr-2 overflow-hidden">
        {persona.portraitUrl ? (
          <img 
            src={persona.portraitUrl} 
            alt={`${persona.gender} portrait`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>
      <div>
        <div className="text-sm">
          {persona.gender}, age {persona.ageMin}-{persona.ageMax}
        </div>
        <div className="text-sm">
          {interests.map((interest, index) => (
            <div key={index}>{interest}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonaCell;
