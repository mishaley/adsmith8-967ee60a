
import React, { useState } from "react";
import { Loader, RefreshCw, AlertTriangle, WifiOff } from "lucide-react";
import { Persona } from "./types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PortraitRowProps {
  personas: Persona[];
  isGeneratingPortraits: boolean;
  loadingIndices?: number[];
  failedIndices?: number[];
  onRetryPortrait?: (index: number) => void;
}

const PortraitRow: React.FC<PortraitRowProps> = ({ 
  personas, 
  isGeneratingPortraits,
  loadingIndices = [],
  failedIndices = [],
  onRetryPortrait
}) => {
  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);

  const handleRetry = (index: number) => {
    if (onRetryPortrait) {
      onRetryPortrait(index);
    }
  };

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
                      alt={`Portrait of persona ${index + 1}`}
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
                    alt={`Large portrait of persona ${index + 1}`}
                    className="max-w-[400px] max-h-[400px] h-auto rounded-md"
                  />
                </PopoverContent>
              </Popover>
            ) : personas.length > 0 && index < personas.length ? (
              loadingIndices.includes(index) ? (
                <div className="w-full aspect-square bg-transparent rounded-md flex flex-col items-center justify-center">
                  <Loader className="h-4 w-4 animate-spin mb-2 text-blue-500" />
                  <span className="text-sm text-gray-500">Generating portrait...</span>
                </div>
              ) : (
                <div className="w-full aspect-square bg-transparent rounded-md flex flex-col items-center justify-center text-sm text-gray-500">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center">
                          {failedIndices?.includes(index) ? (
                            <WifiOff className="h-4 w-4 text-red-500 mb-2" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-amber-500 mb-2" />
                          )}
                          <div className="mb-2 text-center">
                            {isGeneratingPortraits ? "Waiting in queue..." : "Portrait generation failed"}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>The edge function may be unavailable or experiencing connectivity issues.</p>
                        <p className="text-xs mt-1">Check Supabase logs for more details.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {!isGeneratingPortraits && onRetryPortrait && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleRetry(index)}
                      className="mt-2 text-xs"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Retry
                    </Button>
                  )}
                </div>
              )
            ) : (
              <div className="w-full aspect-square bg-transparent rounded-md flex items-center justify-center text-sm text-gray-500">
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
