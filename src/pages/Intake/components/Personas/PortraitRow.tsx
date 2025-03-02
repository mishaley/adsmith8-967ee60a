
import React from "react";
import { Loader } from "lucide-react";
import { Persona } from "./types";

interface PortraitRowProps {
  personas: Persona[];
  isGeneratingPortraits: boolean;
}

const PortraitRow: React.FC<PortraitRowProps> = ({ 
  personas, 
  isGeneratingPortraits
}) => {
  return (
    <tr>
      {Array.from({ length: 5 }).map((_, index) => (
        <td key={index} className="py-3 px-3 border-r" style={{ width: "20%" }}>
          <div className="flex flex-col items-center">
            {personas[index]?.portraitUrl ? (
              <img 
                src={personas[index].portraitUrl} 
                alt={`Portrait of ${personas[index]?.title || `Persona ${index + 1}`}`}
                className="w-full h-auto rounded-md"
                onError={(e) => {
                  // Handle image loading errors
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  
                  // Create a placeholder for failed images
                  const parentEl = target.parentElement;
                  if (parentEl) {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'w-full h-32 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-500';
                    placeholder.innerText = 'Failed to load image';
                    parentEl.appendChild(placeholder);
                  }
                }}
              />
            ) : personas.length > 0 && index < personas.length ? (
              isGeneratingPortraits ? (
                <div className="w-full h-32 bg-gray-100 rounded-md flex flex-col items-center justify-center">
                  <Loader className="h-4 w-4 animate-spin mb-2" />
                  <span className="text-sm text-gray-500">Generating...</span>
                </div>
              ) : (
                <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-500">
                  Waiting for portrait
                </div>
              )
            ) : (
              <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-500">
                No persona data
              </div>
            )}
          </div>
        </td>
      ))}
    </tr>
  );
};

export default PortraitRow;
