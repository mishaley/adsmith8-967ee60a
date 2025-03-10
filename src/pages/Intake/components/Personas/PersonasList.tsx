
import React, { useState, useEffect } from "react";
import { Persona } from "./types";
import { Trash2 } from "lucide-react";
import { logDebug } from "@/utils/logging";

interface PersonasListProps {
  personas: Persona[];
  onRemovePersona?: (index: number) => void;
  personaCount?: number;
}

const PersonasList: React.FC<PersonasListProps> = ({ 
  personas, 
  onRemovePersona,
  personaCount = 5 // Default to 5 for backward compatibility
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Debug log when personas change
  useEffect(() => {
    logDebug(`PersonasList rendered with ${personas?.length || 0} personas, showing max ${personaCount}`, 'ui');
    if (personas?.length > 0) {
      logDebug("First persona in list: " + JSON.stringify(personas[0]), 'ui');
    }
  }, [personas, personaCount]);

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

  // Calculate width percentage based on persona count
  const getColumnWidth = () => {
    return `${100 / personaCount}%`;
  };

  // Render only the requested number of columns
  return (
    <tr className="border-transparent">
      {Array.from({ length: personaCount }).map((_, index) => (
        <td 
          key={index} 
          className="py-3 px-3 align-top relative border-transparent" 
          style={{ width: getColumnWidth() }}
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
