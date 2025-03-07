
import React, { useState } from "react";
import { Persona } from "./types";
import { Trash2 } from "lucide-react";

interface PersonasListProps {
  personas: Persona[];
  onRemovePersona?: (index: number) => void;
}

const PersonasList: React.FC<PersonasListProps> = ({ personas, onRemovePersona }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Format interests to display on two rows if needed
  const formatInterests = (interests: string[]): React.ReactNode => {
    if (!interests || interests.length === 0) return null;
    
    // Split interests into chunks of reasonable size for two rows
    const midpoint = Math.ceil(interests.length / 2);
    const firstRow = interests.slice(0, midpoint).join(", ");
    const secondRow = interests.slice(midpoint).join(", ");
    
    return (
      <>
        <div className="text-sm mt-1">{firstRow}</div>
        {secondRow && <div className="text-sm mt-1">{secondRow}</div>}
      </>
    );
  };

  // Always render 5 columns, populated with personas data when available
  return (
    <tr className="border-transparent">
      {Array.from({ length: 5 }).map((_, index) => (
        <td 
          key={index} 
          className="py-3 px-3 align-top relative border-transparent" 
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
              <div className="text-sm">{personas[index].gender}</div>
              <div className="text-sm">Age {personas[index].ageMin}-{personas[index].ageMax}</div>
              {formatInterests(personas[index].interests)}
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
