
import React, { useState } from "react";
import { Persona } from "./types";
import { Trash2 } from "lucide-react";

interface PersonasListProps {
  personas: Persona[];
  onRemovePersona?: (index: number) => void;
}

const PersonasList: React.FC<PersonasListProps> = ({ personas, onRemovePersona }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Always render 5 columns, populated with personas data when available
  return (
    <tr>
      {Array.from({ length: 5 }).map((_, index) => (
        <td 
          key={index} 
          className="py-3 px-3 border-r align-top relative" 
          style={{ width: "20%" }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {personas[index] ? (
            <div className="flex flex-col">
              {hoveredIndex === index && personas[index] && onRemovePersona && (
                <button
                  className="absolute top-1 right-1 text-gray-500 hover:text-red-500 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemovePersona(index);
                  }}
                  aria-label="Remove persona"
                >
                  <Trash2 size={18} />
                </button>
              )}
              <div className="text-sm">{personas[index].gender}, age {personas[index].ageMin}-{personas[index].ageMax}</div>
              <div className="text-sm mt-1">{personas[index].interests.join(", ")}</div>
            </div>
          ) : (
            <div className="text-gray-400"></div>
          )}
        </td>
      ))}
    </tr>
  );
};

export default PersonasList;
