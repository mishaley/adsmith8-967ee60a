
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Persona } from "./types";

interface PortraitRowProps {
  personas: Persona[];
  generatePortrait: (persona: Persona, index: number) => void;
  generatingPortraitFor: number | null;
  generatingAllPortraits: boolean;
}

const PortraitRow: React.FC<PortraitRowProps> = ({ 
  personas, 
  generatePortrait, 
  generatingPortraitFor, 
  generatingAllPortraits 
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
                  // Handle image loading errors by replacing with a generate button
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parentEl = target.parentElement;
                  if (parentEl && personas[index]) {
                    // Create a generate button when the image fails to load
                    const btn = document.createElement('button');
                    btn.className = 'w-full mt-1 px-4 py-2 text-sm border rounded hover:bg-gray-100';
                    btn.innerText = 'Generate Portrait';
                    btn.onclick = () => generatePortrait(personas[index], index);
                    parentEl.appendChild(btn);
                  }
                }}
              />
            ) : personas.length > 0 && index < personas.length ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => generatePortrait(personas[index], index)}
                disabled={generatingPortraitFor !== null || generatingAllPortraits}
                className="w-full mt-1"
              >
                {generatingPortraitFor === index ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  "Generate Portrait"
                )}
              </Button>
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
