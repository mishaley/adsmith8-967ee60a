
import React from "react";
import { Persona } from "../Personas/types";
import { User } from "lucide-react";

interface PersonaCellProps {
  persona: Persona;
  index: number;
}

const PersonaCell: React.FC<PersonaCellProps> = ({ persona, index }) => {
  return (
    <div className="flex items-center">
      {persona.portraitUrl ? (
        <img 
          src={persona.portraitUrl} 
          alt={`Portrait of ${persona.title || `Persona ${index + 1}`}`}
          className="w-16 h-16 rounded-md object-cover mr-2"
        />
      ) : (
        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center mr-2">
          <User className="h-8 w-8 text-gray-500" />
        </div>
      )}
      <div>
        <div className="text-sm text-gray-500">
          {persona.gender}, {persona.ageMin}-{persona.ageMax}
        </div>
        {persona.interests && persona.interests.length > 0 ? (
          <div className="text-sm text-gray-500">
            {persona.interests.map((interest, i) => (
              <div key={i}>{interest}</div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500">No interests</div>
        )}
      </div>
    </div>
  );
};

export default PersonaCell;
