
import React, { useState } from "react";
import { Loader } from "lucide-react";
import { Persona } from "./types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface PortraitRowProps {
  personas: Persona[];
  isGeneratingPortraits: boolean;
}

const PortraitRow: React.FC<PortraitRowProps> = ({ 
  personas, 
  isGeneratingPortraits
}) => {
  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);

  return (
    <tr>
      {Array.from({ length: 5 }).map((_, index) => (
        <td key={index} className="py-3 px-3 border-r" style={{ width: "20%" }}>
          <div className="flex flex-col items-center">
            {personas[index]?.portraitUrl ? (
              <Popover open={openPopoverIndex === index} onOpenChange={(open) => {
                if (open) {
                  setOpenPopoverIndex(index);
                } else {
                  setOpenPopoverIndex(null);
                }
              }}>
                <PopoverTrigger asChild>
                  <div 
                    className="cursor-pointer transition-all hover:opacity-90 hover:shadow-md rounded-md"
                    onMouseEnter={() => setOpenPopoverIndex(index)}
                    onMouseLeave={() => setOpenPopoverIndex(null)}
                  >
                    <img 
                      src={personas[index].portraitUrl} 
                      alt={`Portrait of ${personas[index]?.title || `Persona ${index + 1}`}`}
                      className="w-full h-auto rounded-md"
                      onError={(e) => {
                        console.log(`Image failed to load for persona ${index + 1}:`, personas[index].portraitUrl);
                        // Handle image loading errors
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        
                        // Create a placeholder for failed images
                        const parentEl = target.parentElement;
                        if (parentEl) {
                          const placeholder = document.createElement('div');
                          placeholder.className = 'w-full h-32 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-500';
                          placeholder.innerText = 'Image failed to load';
                          parentEl.appendChild(placeholder);
                        }
                      }}
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent 
                  className="p-0 rounded-md shadow-xl"
                  onMouseEnter={() => setOpenPopoverIndex(index)}
                  onMouseLeave={() => setOpenPopoverIndex(null)}
                >
                  <img 
                    src={personas[index].portraitUrl} 
                    alt={`Large portrait of ${personas[index]?.title || `Persona ${index + 1}`}`}
                    className="max-w-[400px] max-h-[400px] h-auto rounded-md"
                  />
                </PopoverContent>
              </Popover>
            ) : personas.length > 0 && index < personas.length ? (
              isGeneratingPortraits ? (
                <div className="w-full h-32 bg-gray-100 rounded-md flex flex-col items-center justify-center">
                  <Loader className="h-4 w-4 animate-spin mb-2" />
                  <span className="text-sm text-gray-500">Generating portrait...</span>
                </div>
              ) : (
                <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-500">
                  Portrait generation pending
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
